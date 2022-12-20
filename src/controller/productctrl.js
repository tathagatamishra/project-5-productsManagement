const productModel = require('../model/productmodel')

exports.getProductById = async (req, res) => {
    try {

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}