const productModel = require('../model/productmodel')

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

