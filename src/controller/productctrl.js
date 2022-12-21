const productModel = require('../model/productmodel')

const validWare = require('../middleware/validware')
const { isValidString, isValidStyle, isValidPrice, isValidObjectId } = validWare



exports.createProduct = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please provide the data" })
        }
        // destructuring fields from data
        let { title, description, price, currencyId, currencyFormat, availableSizes, installments, style, isFreeShipping, productImage } = data;

        if (!title) return res.status(400).send({ status: false, message: "title required" });
        if (!isValidString(title)) return res.status(400).send({ status: false, message: "please provide valid string" })
        // checking duplicate title
        let duplicateTitle = await productModel.findOne({ title: title });
        if (duplicateTitle) return res.status(400).send({ status: false, message: "title already exist in use" });

        if (!description) return res.status(400).send({ status: false, message: "description required" });
        if (!isValidString(description)) return res.status(400).send({ status: false, message: "please provide valid description" })

        if (!price) return res.status(400).send({ status: false, message: "price required" });
        if (!isValidPrice(price)) {
            return res.status(400).send({ status: false, message: "Price is not present in correct format" })
        }
        if (!currencyId) return res.status(400).send({ status: false, message: "currencyId required" });
        if (currencyId !== "INR") {
            return res.status(400).send({ status: false, message: "CurrencyId is not correct" })
        }
        if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat required" });
        if (currencyFormat != '₹') {
            return res.status(400).send({ status: false, message: "Please enter a valid currencyFormat" })
        }
        if (!availableSizes) return res.status(400).send({ status: false, message: "availableSizes required" });
        let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        if (!sizes.includes(availableSizes))
            return res.status(400).send({ status: false, msg: "Please Provide valid size from :  S, XS, M, X, L, XXL, XL", });
        if (!installments) return res.status(400).send({ status: false, message: "installments required" });
        if (!(installments || typeof installments == Number)) {
            return res.status(400).send({ status: false, message: "Installments should in correct format" })
        }
        if (!style) return res.status(400).send({ status: false, message: "style required" });
        if (!isValidStyle(style)) {
            return res.status(400).send({ status: false, message: "Style is not in correct format" })
        }
        if (!isFreeShipping) return res.status(400).send({ status: false, message: "isFreeShipping required" });
        if (!(isFreeShipping == "true" || isFreeShipping == "false")) {
            return res.status(400).send({ status: false, message: "Please enter a boolean value for isFreeShipping" })
        }
        const file = req.files

        if (file && file.length > 0) {
            if (file[0].mimetype.indexOf('image') == -1) {
                return res.send({ status: false, message: "Provide an image file" })
            }
            const profileURL = await uploadFile(file[0])

            data.productImage = profileURL
            let createProduct = await productModel.create(data);
            return res.status(201).send({ status: true, message: "Success", data: createProduct });
        } else {
            res.status(400).send({ status: false, msg: "No files found" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

exports.getProductDetails = async function (req, res) {
    try {
        let queries = req.query

        let { name, size, priceGreaterThan, priceLessThan } = queries
        let reg = `^${name}`

        //!===============================================
        if (name && size && priceGreaterThan && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, availableSizes: size, price: { $gt: priceGreaterThan }, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 1", data: product })
        }
        if (name && size && priceGreaterThan) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, availableSizes: size, price: { $gt: priceGreaterThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 2", data: product })
        }
        if (name && size && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, availableSizes: size, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 3", data: product })
        }
        if (size && priceGreaterThan && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, availableSizes: size, price: { $gt: priceGreaterThan }, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 4", data: product })
        }
        if (size && priceGreaterThan) {

            let product = await productModel.find({ isDeleted: false, availableSizes: size, price: { $gt: priceGreaterThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 5", data: product })
        }
        if (size && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, availableSizes: size, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 6", data: product })
        }
        if (name && priceGreaterThan && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, price: { $gt: priceGreaterThan }, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 7", data: product })
        }
        if (name && priceGreaterThan) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, price: { $gt: priceGreaterThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 8", data: product })
        }
        if (name && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 9", data: product })
        }
        if (priceGreaterThan && priceLessThan) {

            let product = await productModel.find({ isDeleted: false, price: { $gt: priceGreaterThan }, price: { $lt: priceLessThan } }).sort({ price: 1 }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 10", data: product })
        }
        if (priceGreaterThan) {

            let product = await productModel.find({ isDeleted: false, price: { $gt: priceGreaterThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 11", data: product })
        }
        if (priceLessThan) {

            let product = await productModel.find({ isDeleted: false, price: { $lt: priceLessThan } }).sort({ price: 1 })
            return res.status(200).send({ status: true, message: "Success 12", data: product })
        }
        if (name && size) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' }, availableSizes: size })
            return res.status(200).send({ status: true, message: "Success 13", data: product })
        }
        if (name) {

            let product = await productModel.find({ isDeleted: false, title: { $regex: reg, $options: 'im' } })
            return res.status(200).send({ status: true, message: "Success 14", data: product })
        }
        if (size) {

            let product = await productModel.find({ isDeleted: false, availableSizes: size })
            return res.status(200).send({ status: true, message: "Success 15", data: product })
        }

        //!===============================================


        let product = await productModel.find({ isDeleted: false })

        return res.status(200).send({ status: true, message: "Success 16", data: product })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.getProductById = async (req, res) => {
    try {
        let id = req.params.productId

        let product = await productModel.findOne({ _id: id, })

        if (!product) return res.status(404).send({ status: false, message: "Product not found" })

        return res.status(200).send({ status: true, message: "Success", data: product })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: `productId: ${productId} is invalid.` });
        const checkId = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!checkId) {
            return res.status(404).send({ status: false, message: "product not found" })
        }
        await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: { isDeleted: true, isDeletedAt: Date.now() } }, { new: true })
        return res.status(200).send({ status: true, message: "Product deleted Successfully" })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}