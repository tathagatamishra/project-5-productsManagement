const userModel = require('../model/usermodel')
const productModel = require('../model/productmodel')
const cartModel = require('../model/cartmodel')
const orderModel = require('../model/ordermodel')



exports.createOrder = async (req, res) => {
    try {
        //todo checking if user id is present or not --
        let userId = req.params.userId
        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: "User not found" })

        //todo if user is present, let's check if user having a cart or not --
        let cart = await cartModel.findOne({ userId: userId }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        if (!cart) return res.status(404).send({ status: false, message: "Bro..! 😑 You do not have a cart. 🛒 First create a cart and the come here to place order...!" })

        //todo if user have cart, now checking the cart is empty or not --
        if (cart.items.length == 0) return res.status(404).send({ status: false, message: "Your cart is empty, maybe you do not have any money 💰, so sad... 🥺 here, take this ₹5 💵 , and add some food 🍕 in your cart, and subscribe to my YouTube channel 🔔: https://www.youtube.com/c/vfxinvein , learn VFX & earn money" })

        //todo now it's time to check if any product is out of stock or not --
        //todo only add available products in order items array 
        let itemArray = cart.items

        for (let p = 0; p < itemArray.length; p++) {

            let product = await productModel.find({ _id: itemArray[p].productId })

            if (Object.keys(product).length != 0) {
                itemArray.splice(itemArray[i], 1)
            }
        }

        let totalPrice = 0
        let totalQuantity = 0
        for (let i = 0; i < itemArray.length; i++) {
            totalQuantity = totalQuantity + itemArray[i].quantity
        }

        let order = {
            itemArray,
            totalPrice: 0,
            totalItems: itemArray.length,
            totalQuantity: totalQuantity,
        }

        let createOrder = await orderModel.create(order)
        return res.status(200).send({ status: true, data: createOrder })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateOrder = async (req, res) => {
    try {
        let userId = req.params.userId

        let user = await userModel.findById(userId)

        if (Object.keys(user).length == 0) return res.status(404).send({ status: false, message: "User not found" })

        let cart = await cartModel.findOne({ userId: userId }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean()

        if (Object.keys(cart).length == 0) return res.status(404).send({ status: false, message: "Your cart is empty, maybe you do not have any money 💰, so sad... 🥺 here, take this ₹5 💵 , and add some food 🍕 in your cart, and subscribe to my YouTube channel 🔔: https://www.youtube.com/c/vfxinvein , learn VFX & earn money" })

        let order = await orderModel.findOne({ userId: userId })

        if (Object.keys(order).length == 0) return res.status(404).send({ status: false, message: "Place your order, before update" })

        let up

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}