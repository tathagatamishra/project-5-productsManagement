const validWare = require('./validware.js')

const userValidations = (req, res, next) => {
    const mandatoryFields = ['fname', 'lname', "email", "password", "phone"]

    for (let i of mandatoryFields) {
        if (!req.body[i]) {
            return res.status(400).send({ status: false, message: `${i} is not present` })
        }
    }

    if (!req.body.address) {
        return res.status(400).send({ status: false, message: 'Address is not present' })
    }
    req.body.address = JSON.parse(req.body.address)
    if (typeof req.body.address != 'object') {
        return res.status(400).send({ status: false, message: `Address is not an object` })
    } else {
        const { shipping, billing } = req.body.address
        if (!shipping || typeof shipping != 'object') {
            return res.status(400).send({ status: false, message: `Shipping address is eiether not provided or is not an object` })
        }
        if (!billing || typeof billing != 'object') {
            return res.status(400).send({ status: false, message: `Billing address is eiether not provided or is not an object` })
        }
        else {
            var { street, city, pincode } = shipping
            if (typeof street != 'string' || typeof city != 'string' || typeof pincode != 'number') {
                return res.status(400).send({ status: false, message: `street and city in shipping address should be string and pincode should be a number` })
            }
            var { street, city, pincode } = billing
            if (typeof street != 'string' || typeof city != 'string' || typeof pincode != 'number') {
                return res.status(400).send({ status: false, message: `street and city in billing address should be string and pincode should be a number` })
            }
        }
    }
    //regex matching
    if (!validWare.isValidName(req.body.fname)) {
        return res.status(400).send({ status: false, message: "Provide a valid fname" })
    }
    if (!validWare.isValidName(req.body.lname)) {
        return res.status(400).send({ status: false, message: "Provide a valid lname" })
    }
    if (!validWare.isValidEmail(req.body.email)) {
        return res.status(400).send({ status: false, message: "Provide a valid email" })
    }
    if (!validWare.isValidMobile(req.body.phone)) {
        return res.status(400).send({ status: false, message: "Provide a valid indian phone no." })
    }
    if (req.body.password.length < 8 || req.body.password.length > 15) {
        return res.status(400).send({ status: false, message: "Provide a valid password" })
    }
    if (!validWare.isValidName(req.body.fname)) {
        return res.status(400).send({ status: false, message: "Provide a valid fname" })
    }
    let add = req.body.address.shipping
    if (!validWare.isValidPincode(add.pincode)) {
        return res.status(400).send({ status: false, message: "Provide a valid pincode in shipping address" })
    }
    if (!/^[a-zA-Z0-9-_./\ ]{1,50}$/.test(add.street)) {
        return res.status(400).send({ status: false, message: "Provide a valid street in shipping address" })
    }
    if (!validWare.isValidName(add.city)) { //name regex is also used for city name
        return res.status(400).send({ status: false, message: "Provide a valid city in shipping address" })
    }

    add = req.body.address.billing
    if (!validWare.isValidPincode(add.pincode)) {
        return res.status(400).send({ status: false, message: "Provide a valid pincode in billing address" })
    }
    if (!/^[a-zA-Z0-9-_./\ ]{1,50}$/.test(add.street)) {
        return res.status(400).send({ status: false, message: "Provide a valid street in billing address" })
    }
    if (!validWare.isValidName(add.city)) { //name regex is also used for city name
        return res.status(400).send({ status: false, message: "Provide a valid pincode in billing address" })
    }
    next()
}
module.exports = userValidations
