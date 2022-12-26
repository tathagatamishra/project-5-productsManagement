const jwt = require('jsonwebtoken')
const userModel = require('../model/usermodel')


exports.authentication = async (req, res, next) => {

    try {



        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


exports.authorization = async (req, res, next) => {

    try {
        


        next()
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
