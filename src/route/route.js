const express = require('express')

const router = express.Router()

const {userReg, userLogin, getUser, updateUser} = require('../controller/userctrl')
const {getProductById, createProduct, getProductDetails, deleteProduct, updateProduct} = require('../controller/productctrl')
const {createOrder, updateOrder} = require('../controller/orderctrl')
const userValidations = require('../middleware/userValidations')
const { updateCart,addToCart } = require('../controller/cartctrl')



// User APIs ------
router.post  ('/register', userValidations, userReg)
router.post  ('/login', userLogin)
router.get   ('/user/:userId/profile', getUser)
router.put   ('/user/:userId/profile', updateUser)

//todo Products APIs ------
router.post  ('/products',            createProduct    )
router.get   ('/products',            getProductDetails)
router.get   ('/products/:productId', getProductById   )
router.put   ('/products/:productId', updateProduct    )
router.delete('/products/:productId', deleteProduct    )

//todo Cart APIs ------
router.post  ('/users/:userId/cart', addToCart )
router.put   ('/users/:userId/cart', updateCart)
router.get   ('/users/:userId/cart', )
router.delete('/users/:userId/cart', )

//todo Checkout/Order APIs ------
router.post  ('/users/:userId/orders', createOrder)
router.put   ('/users/:userId/orders', updateOrder)


module.exports = router
