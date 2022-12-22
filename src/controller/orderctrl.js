const userModel    = require('../model/usermodel'   )
const productModel = require('../model/productmodel')
const cartModel    = require('../model/cartmodel'   )
const orderModel   = require('../model/ordermodel'  )



exports.createOrder = async (req, res) => {
    try {
        let userId = req.params.userId

        let user = await userModel.findById(userId)

        if (!user) return res.status(404).send({status: false, message: "User not found"})

        let cart = await cartModel.findOne({userId: userId}).select({_id: 0, __v: 0, createdAt: 0, updatedAt: 0}).lean()
        
        if (!cart) return res.status(404).send({status: false, message: "Your cart is empty, maybe you do not have any money 💰, so sad... 🥺 here, take this ₹5 💵 , and add some food 🍕 in your cart, and subscribe to my YouTube channel 🔔: https://www.youtube.com/c/vfxinvein , learn VFX & earn money"})

        let totalQuantity = 0
        for (let i = 0; i < cart.items.length; i++) {
            totalQuantity = totalQuantity + cart.items[i].quantity
        }

        let orderStatus = req.body.status
        let cancellable
        let order
        
        if (orderStatus) {
            if (orderStatus == 'completed') {
                cancellable = false
            }
            else {
                cancellable = true
            }
            order = {
                ...cart, 
                totalQuantity: totalQuantity,
                cancellable: cancellable,
                status: orderStatus
            }
        }
        else {
            order = {
                ...cart, 
                totalQuantity: totalQuantity
            }
        }

        let createOrder = await orderModel.create(order)
        return res.status(200).send({status: true, data: createOrder})
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateOrder = async (req, res) => {
    try {
        let userId = req.params.userId
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}