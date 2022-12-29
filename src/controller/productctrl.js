const productModel = require('../model/productmodel')
const AWS = require('../controller/aws')
const validWare = require('../middleware/validware')
const { isValidString, isValidStyle, isValidPrice, isValidObjectId, validNum } = validWare


exports.createProduct = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide the product details" })
        }
        // destructuring fields from data
        let { title, description, price, currencyId, currencyFormat, availableSizes, installments, style, isFreeShipping } = data

        if (!title || !isValidString(title)) return res.status(400).send({ status: false, message: "Product title is required" })

        // checking duplicate title
        let duplicateTitle = await productModel.findOne({ title: title })
        if (duplicateTitle) return res.status(400).send({ status: false, message: "This title already in use, try another" })


        if (!description || !isValidString(description)) return res.status(400).send({ status: false, message: "Please provide product description" })

        if (!price || !isValidPrice(price)) return res.status(400).send({ status: false, message: "Mention product price 🤑" })


        if (currencyId) return res.status(400).send({ status: false, message: "You can not set currency id (default id: INR)" })
        if (currencyFormat) return res.status(400).send({ status: false, message: "You can not set currency format (default format: ₹)" })


        if (!availableSizes) return res.status(400).send({ status: false, message: "Provide the size of your product" })

        let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        if (!sizes.includes(availableSizes)) return res.status(400).send({ status: false, message: "Please Provide valid size from: S, XS, M, X, L, XXL, XL" })


        if (!installments) return res.status(400).send({ status: false, message: "Installments required" })
        if (!Number(installments)) return res.status(400).send({ status: false, message: "Installments should a number" })

        if (style) {
            if (!isValidStyle(style)) {
                return res.status(400).send({ status: false, message: "Style is not in correct format" })
            }
        }

        if (isFreeShipping) {
            if (!(isFreeShipping == "true" || isFreeShipping == "false")) {
                return res.status(400).send({ status: false, message: "Please enter a boolean value for isFreeShipping" })
            }
        }

        let image = req.files
        if (image == undefined || image.length == 0) return res.status(400).send({ status: false, message: "Please provide a product image" })


        if (image.length == 1) {

            if (image[0].mimetype.split('/')[0] != 'image') {
                return res.status(400).send({ status: false, message: "Provide a jpeg or png file 📷" })
            }
            let imageLink = await AWS.uploadFile(image[0])
            data.productImage = imageLink
        }
        const createProduct = await productModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: createProduct });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.getProductDetails = async function (req, res) {
    try {
        let queries = req.query

        let { name, size, priceGreaterThan, priceLessThan, priceSort } = queries

        let reg = `^${name}`   //! match starting value

        let obj = {}

        if (name) { obj.title = { $regex: reg, $options: 'im' } } //! i = case insensitive, m = match

        if (size) { obj.availableSizes = size }

        if (priceGreaterThan && priceLessThan) { obj.price = { $gt: priceGreaterThan, $lt: priceLessThan } }

        else if (priceGreaterThan) { obj.price = { $gt: priceGreaterThan } }

        else if (priceLessThan) { obj.price = { $lt: priceLessThan } }

        let product

        if (priceSort) {

            priceSort = Number(priceSort)
            
            if(![1,-1].includes(priceSort)) return res.status(400).send({status:false,message:"priceSort only accepts 1 or -1"})

            product = await productModel.find({ isDeleted: false, ...obj }).sort({ price: priceSort })
        }
        else {
            product = await productModel.find({ isDeleted: false, ...obj })
        }

        if (product.length == 0) return res.status(404).send({ status: false, message: 'No product found 😕' })

        return res.status(200).send({ status: true, message: "Success", data: product })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateProduct = async function (req, res) {
    try {
        let id = req.params.productId

        if (!isValidObjectId(id)) return res.status(400).send({ status: false, message: "Invalid ProductId" })

        let product = await productModel.findOne({ _id: id, isDeleted: false })

        if (!product) return res.status(404).send({ status: false, message: "Product not Found" })

        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please provide data for updation" })
        }

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes } = data

        if (title) {
            if (!isValidName(title) && !isValidString(title)) return res.status(400).send({ status: false, message: "please provide valid title" })
        }

        let duplicateTitle = await productModel.findOne({ title: title })
        if (duplicateTitle) return res.status(400).send({ status: false, message: "please provide unique title" })
        if (description) {
            if (!isValidString(description)) return res.status(400).send({ status: false, message: "please provide valid description" })
        }
        if (price) {
            if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "please provide valid price" })
        }
        if (currencyId) {
            if (currencyId !== "INR") return res.status(400).send({ status: false, message: "please provide valid currencyId" })
        }
        if (currencyFormat) {
            if (currencyFormat !== '₹') return res.status(400).send({ status: false, message: "Please provide valid currencyFormat" })
        }
        if (isFreeShipping) {
            if (!(isFreeShipping == "true" || isFreeShipping == "false")) return res.status(400).send({ status: false, message: "Please enter a boolean value for isFreeShipping" })
        }

        let image = req.files

        if ((image == undefined || image.length == 0) && Object.keys(data).length == 0) return res.status(200).send({ status: true, message: "Nothing to update 😜" })

        if (image.length == 1) {

            if (image[0].mimetype.split('/')[0] != 'image') return res.status(400).send({ status: false, message: "Provide a jpeg or png file 📷" })

            let imageLink = await uploadFile(image[0])
            req.body.productImage = imageLink
        }

        if (style) {
            if (!isValidStyle(style) && !isValidString(style)) return res.status(400).send({ status: false, message: "please provide valid style" })
        }
        if (availableSizes) {
            let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
            if (!sizes.includes(availableSizes)) return res.status(400).send({ status: false, message: "Please provide valid size from :  S, XS, M, X, L, XXL, XL", });
        }

        let updateProduct = await productModel.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })

        return res.status(200).send({ status: false, message: 'Success', data: updateProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.getProductById = async (req, res) => {
    try {
        let id = req.params.productId

        let product = await productModel.findOne({ _id: id, isDeleted: false })

        if (!product) return res.status(404).send({ status: false, message: "Product not found 😕" })

        return res.status(200).send({ status: true, message: "Success", data: product })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: `ProductId: ${productId} is invalid.` })

        let checkId = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!checkId) return res.status(404).send({ status: false, message: "Product not found 😕" })

        await productModel.findOneAndUpdate(

            { _id: productId, isDeleted: false },
            { $set: { isDeleted: true, isDeletedAt: Date.now() } },
            { new: true }
        )

        return res.status(200).send({ status: true, message: "Product deleted Successfully" })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}