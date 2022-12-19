const express = require('express')

const router = express.Router()

const {userLogin} = require('../controller/userctrl')



//! User APIs ------
router.post  ('/register', )
router.post  ('/login', userLogin)
router.get   ('/user/:userId/profile', )
router.put   ('/user/:userId/profile', )

//todo Products APIs ------
router.post  ('/products', )
router.get   ('/products', )
router.get   ('/products/:productId', )
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