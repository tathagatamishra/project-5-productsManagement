const express = require('express')

const router = express.Router()

const {userReg, userLogin, getUser, updateUser} = require('../controller/userctrl')
const {getProductById, createProduct} = require('../controller/productctrl')
const userValidations = require('../middleware/userValidations')



// User APIs ------
router.post  ('/register', userValidations, userReg)
router.post  ('/login', userLogin)
router.get   ('/user/:userId/profile', getUser)
router.put   ('/user/:userId/profile', updateUser)

//! Products APIs ------
router.post  ('/products', createProduct)
router.get   ('/products', )
router.get   ('/products/:productId', getProductById)
router.put   ('/products/:productId', )
router.delete('/products/:productId', )

//todo Cart APIs ------
router.post  ('/users/:userId/cart', )
router.put   ('/users/:userId/cart', )
router.get   ('/users/:userId/cart', )
router.delete('/users/:userId/cart', )

//todo Checkout/Order APIs ------
router.post  ('/users/:userId/orders', )
router.put   ('/users/:userId/orders', )


module.exports = router