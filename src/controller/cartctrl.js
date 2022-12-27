const productModel = require('../model/productmodel')
const userModel = require('../model/usermodel')
const cartModel = require("../model/cartmodel")
const { isValidObjectId } = require('mongoose')

exports.addToCart = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Request body cannot be empty" })
        }
        let { productId, cartId } = req.body

        if (!productId || productId.trim().length == 0 || !isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Product Id is not present or is not a valid objectId" })
        }
        let userId = req.params.userId

        let cart = await cartModel.findOne({ userId })
        if (cart && !cartId) return res.status(400).send({ status: false, message: "Cart exist for the given user please provide cartId" })

        let totalPrice = 0

        if (!cart) {
            let product = await productModel.findById(productId)
            if (!product) return res.status(400).send({ status: false, message: "The product you are trying to add , does not exist" })

            let productArr = [{ productId: product._id, quantity: 1 }]

            totalPrice += product.price

            let data = {
                userId: userId,
                items: productArr,
                totalPrice: totalPrice,
                totalItems: productArr.length
            }
            let createdCart = await cartModel.create(data)
            return res.status(201).send({ status: true, cart: createdCart })
        }

        else {
            if (!cartId || cartId.trim().length == 0 || !isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Product Id is not present or is not a valid objectId" })
            }

            let productArr = cart.items
            totalPrice = cart.totalPrice

            let product = await productModel.findById(productId)
            if (!product) return res.status(400).send({ status: false, message: "The product you are trying to add , does not exist" })

            let isPdtAvailable = productArr.findIndex(e => e.productId == product._id.toString())

            if (isPdtAvailable != -1) {
                productArr[isPdtAvailable].quantity = productArr[isPdtAvailable].quantity + 1
            }
            else {
                productArr.push({ productId: product._id, quantity: 1 })
            }

            totalPrice += product.price

            let updatedCart = await cartModel.findByIdAndUpdate(cartId, { $set: { items: productArr, totalPrice: totalPrice, totalItems: productArr.length } }, { new: true })

            return res.status(200).send({ status: true, cart: updatedCart })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.fetchCart = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "please enter valid userId" })
        }
        let check = await userModel.findOne({ _id: userId })
        if (!check) {
            return res.status(404).send({ status: false, message: "user not found" })
        }

        let getCartData = await cartModel.findOne({ userId: userId });

        if (!getCartData) {
            return res.status(404).send({ status: false, message: "cart is not found" })
        }

        res.status(200).send({ status: true, message: 'Success', data: getCartData })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.updateCart = async (req, res) => {
    try {
        let userId = req.params.userId

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "body can't be empty" })

        let { cartId, productId, removeProduct } = data

        if (!cartId) return res.status(400).send({ status: false, message: "please provide cartId" })
        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "Invalid cartId" })
        let findCart = await cartModel.findById(cartId)
        if (!findCart) return res.status(404).send({ status: false, message: "No cart Found" })
        let index = findCart.items.findIndex(e => e.productId == productId)
        if (index == -1) return res.status(400).send({ status: false, message: "This product does not exist in your cart" })

        if (!productId) return res.status(400).send({ status: false, message: "please provide productId" })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "Invalid productId" })
        let ProductData = await productModel.findById(productId)

        if (!removeProduct) return res.status(400).send({ status: false, message: "please provide removeProduct" })

        if (!(removeProduct == 0 || removeProduct == 1)) return res.status(400).send({ status: false, message: "removeProduct accept only 0 or 1" })

        let updateData = await cartModel.findOne({ _id: cartId })
        let productPrice = ProductData.price
        for (let i = 0; i < updateData.items.length; i++) {
            let qua = 0
            if (removeProduct == 0 && productId == updateData.items[i].productId) {
                qua = updateData.items[i].quantity
                updateData.items.splice(updateData.items[i], 1)
                updateData.totalPrice = updateData.totalPrice - (productPrice * qua)
                updateData.totalItems = updateData.totalItems - 1
            }
            if (removeProduct == 1 && productId == updateData.items[i].productId) {
                if (updateData.items[i].quantity <= 1) {
                    updateData.items.splice(updateData.items[i], 1)
                    updateData.totalPrice = updateData.totalPrice - productPrice
                    updateData.totalItems = updateData.totalItems - 1
                } else {
                    updateData.items[i].quantity = updateData.items[i].quantity - 1
                    updateData.totalPrice = updateData.totalPrice - productPrice
                }
            }
        }
        let result = await cartModel.findOneAndUpdate({ _id: cartId }, { $set: updateData }, { new: true })
        return res.send({ status: true, message: "Success", data: result })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.deleteCart = async (req, res) => {
    try {
        let userId = req.params.userId

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Invalid userId" })
        let findCart = await cartModel.findOne({ userId: userId })
        if (findCart.items.length == 0) return res.status(400).send({ status: false, message: "Cart is Empty" })
        if (Object.keys(findCart).length == 0) return res.status(404).send({ status: false, message: "cart doesn't exist" })

        let items = []
        await cartModel.updateOne(
            { userId: userId },
            { $set: { items: items, totalItems: 0, totalPrice: 0 } },
            { new: true }
        )
        return res.status(204).send({ status: true, message: "Success" })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
