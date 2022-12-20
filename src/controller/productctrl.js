const productModel = require('../model/productmodel')
const uploadFile = require('./awsS3')
const validware = require('../middleware/validware')
const {isValidString,isValidStyle,isValidPrice} = validware

const createProduct = async function(req,res){
    try {
        let data = req.body
        if(Object.keys(data).length == 0){
            return res.status(400).send({status:false , message:"please provide the data"})
        }
        // destructuring fields from data
        let { title, description, price, currencyId, currencyFormat, availableSizes, installments, style, isFreeShipping ,productImage} = data;

        if (!title) return res.status(400).send({ status: false, message: "title required" });
        if(!isValidString(title)) return res.status(400).send({status:false , message:"please provide valid string"})
        // checking duplicate title
        let duplicateTitle = await productModel.findOne({ title: title });
        if (duplicateTitle) return res.status(400).send({ status: false, message: "title already exist in use" });

        if (!description) return res.status(400).send({ status: false, message: "description required" });
        if(!isValidString(description)) return res.status(400).send({status:false , message:"please provide valid description"})

        if (!price) return res.status(400).send({ status: false, message: "price required" });
        if (!isValidPrice(price)) {
            return res.status(400).send({ status: false, message: "Price is not present in correct format" })
        }
        if (!currencyId) return res.status(400).send({ status: false, message: "currencyId required" });
        if (currencyId !== "INR") {
            return res.status(400).send({ status: false, message: "CurrencyId is not correct" })
        }
        if (!currencyFormat) return res.status(400).send({ status: false, message: "currencyFormat required" });
        if(currencyFormat!='₹'){
            return res.status(400).send({status:false,message:"Please enter a valid currencyFormat"})
        }
        if (!availableSizes) return res.status(400).send({ status: false, message: "availableSizes required" });
        let sizes = ["S", "XS","M","X", "L","XXL", "XL"];
        if (!sizes.includes(availableSizes))
          return res.status(400).send({status: false, msg: "Please Provide valid size from :  S, XS, M, X, L, XXL, XL",  });
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
        return res.status(500).send({status:false , msg:error.message})
    }
}

exports.getProductById = async (req, res) => {
    try {
        let id = req.params.productId

        let product = await productModel.findOne({_id: id, })
        
        if (!product) return res.status(404).send({status: false, message: "Product not found"})

        return res.status(200).send({status: true, message: "Success", data: product})
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createProduct = createProduct