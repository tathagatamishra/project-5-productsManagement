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

        let cart = await cartModel.findOne({ userId: userId }).lean()

        if (!cart) return res.status(404).send({ status: false, message: "You do not have a cart. 🛒 First create a cart and the come here to place order" })


        //todo if user have cart, now checking the cart is empty or not --

        if (cart.items.length == 0) return res.status(404).send({ status: false, message: "Your cart is empty," })


        //todo now it's time to check if any product is out of stock or not --
        //todo only add available products in order items array 

        //! 1, 2 & 3 variables will help me to create order object

        let itemArray = cart.items   //! 1

        for (let i = 0; i < itemArray.length; i++) {

            let product = await productModel.findOne({ _id: itemArray[i].productId, isDeleted: false })

            if (!product) {
                itemArray.splice(itemArray[i], 1)
            }
        }

        let totalPrice = 0           //! 2

        for (let i = 0; i < itemArray.length; i++) {

            let product = await productModel.findOne({_id: itemArray[i].productId})
            totalPrice = totalPrice + (itemArray[i].quantity * product.price)
        }

        let totalQuantity = 0        //! 3

        for (let i = 0; i < itemArray.length; i++) {
            totalQuantity = totalQuantity + itemArray[i].quantity
        }

        //todo this order object will get stored in DB --

        let order = {
            userId: userId,
            items: itemArray,
            totalPrice: totalPrice,
            totalItems: itemArray.length,
            totalQuantity: totalQuantity,
        }

        let createOrder = await orderModel.create(order)

        //! after creating order, making the cart empty for user --

        await cartModel.updateOne({userId: userId}, {$set: {items: [], totalPrice: 0,totalQuantity: 0}})

        return res.status(200).send({ status: true, data: createOrder })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateOrder = async (req, res) => {
    try {
        //todo checking if user id is present or not --

        let userId = req.params.userId

        let user = await userModel.findById(userId)

        if (!user) return res.status(404).send({ status: false, message: "User not found" })

        //todo if user is present, let's check if user placed an order or not --
        
        let cart = await cartModel.findOne({ userId: userId }).lean()
        let cartItem = cart.items.length

        let orderDetail = await orderModel.findOne({ userId: userId, isDeleted: false })
        
        if (!orderDetail && cartItem == 0) return res.status(404).send({ status: false, message: "You haven't placed any order, and also your cart is empty" })
        if (!orderDetail && cartItem != 0) return res.status(404).send({ status: false, message: `You have ${cartItem} product in your cart, 1st place an order then try to update order status` })

        if (orderDetail.items.length == 0) {


            return res.status(404).send({ status: false, message: "No items found in your cart order" })
        }
        //todo if user have cart, now checking the cart is empty or not --



        //todo now it's time to check if any product is out of stock or not --
        //todo only add available products in order items array 

        //! 1, 2 & 3 variables will help me to create order object

        let itemArray = cart.items   //! 1

        for (let i = 0; i < itemArray.length; i++) {

            let product = await productModel.findOne({ _id: itemArray[i].productId, isDeleted: false })

            if (!product) {
                itemArray.splice(itemArray[i], 1)
            }
        }

        let totalPrice = 0           //! 2

        for (let i = 0; i < itemArray.length; i++) {

            let product = await productModel.findOne({_id: itemArray[i].productId})
            totalPrice = totalPrice + (itemArray[i].quantity * product.price)
        }

        let totalQuantity = 0        //! 3

        for (let i = 0; i < itemArray.length; i++) {
            totalQuantity = totalQuantity + itemArray[i].quantity
        }

        //todo this order object will get stored in DB --

        let order = {
            userId: userId,
            items: itemArray,
            totalPrice: totalPrice,
            totalItems: itemArray.length,
            totalQuantity: totalQuantity,
        }

        let createOrder = await orderModel.create(orderDetail)

        //! after creating order, making the cart empty for user --

        await cartModel.updateOne({userId: userId}, {$set: {items: [], totalPrice: 0,totalQuantity: 0}})

        return res.status(200).send({ status: true, data: createOrder })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}