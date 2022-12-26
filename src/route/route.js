const express = require('express')

const router = express.Router()

const {authentication, authorization} = require('../middleware/authware')
const {userReg, userLogin, getUser, updateUser} = require('../controller/userctrl')
const {getProductById, createProduct, getProductDetails, deleteProduct, updateProduct} = require('../controller/productctrl')
const {addToCart, fetchCart, updateCart, deleteCart} = require('../controller/cartctrl')
const {createOrder, updateOrder} = require('../controller/orderctrl')



// User APIs ------
router.post  ('/register',             userReg                                  )
router.post  ('/login',                authentication, authorization, userLogin )
router.get   ('/user/:userId/profile', getUser                                  )
router.put   ('/user/:userId/profile', authentication, authorization, updateUser)

//todo Products APIs ------
router.post  ('/products',            createProduct    )
router.get   ('/products',            getProductDetails)
router.get   ('/products/:productId', getProductById   )
router.put   ('/products/:productId', updateProduct    )
router.delete('/products/:productId', deleteProduct    )

//todo Cart APIs ------
router.post  ('/users/:userId/cart',   addToCart )
router.put   ('/users/:userId/cart',   updateCart)
router.get   ('/users/:userId/cart',   fetchCart )
router.delete('/users/:userId/cart',   deleteCart)

//todo Checkout/Order APIs ------
router.post  ('/users/:userId/orders', createOrder)
router.put   ('/users/:userId/orders', updateOrder)


module.exports = router
