const express = require('express')

const router = express.Router()

const {authentication, authorization} = require('../middleware/authware')
const {userReg, userLogin, getUser, updateUser} = require('../controller/userctrl')
const {getProductById, createProduct, getProductDetails, deleteProduct, updateProduct} = require('../controller/productctrl')
const {addToCart, fetchCart, updateCart, deleteCart} = require('../controller/cartctrl')
const {createOrder, updateOrder} = require('../controller/orderctrl')



//todo User APIs ------
router.post  ('/register',             userReg                                  )
router.post  ('/login',                userLogin                                )
router.get   ('/user/:userId/profile', authentication, getUser                  )
router.put   ('/user/:userId/profile', authentication, authorization, updateUser)

//todo Products APIs ------
router.post  ('/products',            createProduct    )
router.get   ('/products',            getProductDetails)
router.get   ('/products/:productId', getProductById   )
router.put   ('/products/:productId', updateProduct    )
router.delete('/products/:productId', deleteProduct    )

//todo Cart APIs ------
router.post  ('/users/:userId/cart', authentication, authorization, addToCart )
router.put   ('/users/:userId/cart', authentication, authorization, updateCart)
router.get   ('/users/:userId/cart', authentication, authorization, fetchCart )
router.delete('/users/:userId/cart', authentication, authorization, deleteCart)

//todo Checkout/Order APIs ------
router.post  ('/users/:userId/orders',authentication,authorization, createOrder)
router.put   ('/users/:userId/orders',authentication,authorization, updateOrder)



module.exports = router
