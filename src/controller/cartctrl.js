const productModel = require('../model/productmodel')
const userModel = require('../model/usermodel')
const cartModel = require("../model/cartmodel");
const { isValidObjectId } = require('../middleware/validware');
// const {isValidObjectId}=require('mongoose')

exports.addToCart=async(req,res)=>{

  if(Object.keys(req.body).length==0){
    return res.status(400).send({status:false,message:"Request body cannot be empty"})
  }
  const {productId,cartId}=req.body
  if(!productId||productId.trim().length==0||!isValidObjectId(productId)){
    return res.status(400).send({status:false,message:"Product Id is not present or is not a valid objectId"})
  }
  const userId=req.params.userId
  const cart=await cartModel.findOne({userId})
  if(cart && !cartId){
    return res.status(400).send({status:false,message:"Cart exist for the given user please provide cartId"})
  }

  let totp=0


  if(!cart){
    const product=await productModel.findById(productId)
    if(!product){
      return res.status(400).send({staus:false,message:"The product you are trying to add , does not exist"})
    }
    const pdtArray=[{productId:product._id,quantity:1}]
    totp+=product.price
    const data={
      userId:userId,
      items:pdtArray,
      totalPrice:totp,
      totalItems:pdtArray.length
    }
    const createdCart=await cartModel.create(data)
    res.status(201).send({status:true,cart:createdCart})
  }

  else{
    if(cartId||cartId.trim().length==0||!isValidObjectId(productId)){
      return res.status(400).send({status:false,message:"Product Id is not present or is not a valid objectId"})
    }
    const pdtArray=cart.items
    // return res.send({pdtArray})
    totp=cart.totalPrice
    const product=await productModel.findById(productId)
    if(!product){
      return res.status(400).send({staus:false,message:"The product you are trying to add , does not exist"})
    }
    const isPdtAvailable=pdtArray.findIndex(e=>e.productId==product._id.toString())
    // return res.send({isPdtAvailable})
    if(isPdtAvailable!=-1){
      pdtArray[isPdtAvailable].quantity=pdtArray[isPdtAvailable].quantity+1
    }
    else{
      pdtArray.push({productId:product._id,quantity:1})
    }
    totp+=product.price
    const updatedCart=await cartModel.findByIdAndUpdate(cartId,{$set:{items:pdtArray,totalPrice:totp,totalItems:pdtArray.length}},{new:true} )
    res.status(200).send({status:true,cart:updatedCart})
  }

}


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

exports.updateCart = async (req, res) => {
    try {
        let userId = req.params.userId

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "body can't be empty" })

        const { cartId, productId, removeProduct } = data

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

