
const userModel = require('../model/usermodel')
const cartModel = require("../model/cartmodel");
const { isValidObjectId } = require('../middleware/validware')

exports.fetchCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid userId" })
        }
        const check = await userModel.findOne({ _id: userId })
        if (!check) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        let getCartData = await cartModel.findOne({ userId: userId });

        if (!getCartData) {
            return res.status(404).send({ status: false, message: "cart is not found" })
        }

        res.status(200).send({ status: true, message: 'Success', data: getCartData })

    } catch (error) {
        return res.staus(500).send({ staus: false, message: error.message })
    }
}
