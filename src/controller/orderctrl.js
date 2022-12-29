const userModel = require('../model/usermodel')
const productModel = require('../model/productmodel')
const cartModel = require('../model/cartmodel')
const orderModel = require('../model/ordermodel')
const { isValidObjectId } = require('mongoose')



exports.createOrder = async (req, res) => {
    try {
        //todo checking if user id is present or not --

        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(404).send({ status: false, message: "Enter a valid user id" })

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

            let product = await productModel.findOne({ _id: itemArray[i].productId })
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

        await cartModel.updateOne({ userId: userId }, { $set: { items: [], totalPrice: 0, totalQuantity: 0 } })

        return res.status(201).send({ status: true, data: createOrder })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateOrder = async (req, res) => {
    try {
        //todo checking if user id is present or not --

        let userId = req.params.userId
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Enter a valid user id" })


        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: "User not found" })
        

        let { orderId, status } = req.body
        
        if (!isValidObjectId(orderId)) return res.status(400).send({ status: false, message: "Enter a valid order id" })
        if (!orderId) return res.status(400).send({ status: false, message: 'Enter the id of your order'})
        
        let order = await orderModel.findOne({ _id: orderId, userId: userId })
        
        if (!order) return res.status(404).send({ status: false, message: 'No order found'})
        
        if (order.status != 'pending') return res.status(400).send({ status: false, message: `This order is already ${order.status}`})
        
        if (!status) return res.status(400).send({ status: false, message: 'Please provide the status of your order'})


        let updatedOrder = await orderModel.findOneAndUpdate({ _id: order._id }, { $set: { status: status, cancellable: false } })

        return res.status(200).send({ status: true, message: `Your order ${status} successfully`, data: updatedOrder })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}