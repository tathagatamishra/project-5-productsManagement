const validWare = require('./validware.js')

exports.userValidations = async (req, res, next) => {
    const mandatoryFields = ['fname', 'lname', "email", "password", "phone"]

    for (let i of mandatoryFields) {
        if (!req.body[i]) {
            return res.status(400).send({ status: false, message: `${i} is not present` })
        }
    }
    let { fname, lname, email, phone, password, address } = req.body

    //todo regex matching ---

    if (!validWare.isValidName(fname)) {
        return res.status(400).send({ status: false, message: "Provide a valid fname" })
    }
    if (!validWare.isValidName(lname)) {
        return res.status(400).send({ status: false, message: "Provide a valid lname" })
    }

    //todo------------

    if (!validWare.isValidEmail(email)) {
        return res.status(400).send({ status: false, message: "Provide a valid email" })
    }
    if (!validWare.isValidMobile(phone)) {
        return res.status(400).send({ status: false, message: "Provide a valid indian phone no." })
    }
    let unique = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] })
    if (unique) {
        if (user.email == email) return res.status(400).send({ status: false, message: "This email is already taken 😕" })
        if (user.phone == phone) return res.status(400).send({ status: false, message: "This mobile number is already taken 😕" })
    }

    if (password.length < 8 || password.length > 15) {
        return res.status(400).send({ status: false, message: "Provide a valid password" })
    }

    //todo------------

    if (!address) return res.status(400).send({ status: false, message: 'Address is not present' })

    if (test(/^\{/) && test(/\}$/)) return res.status(400).send({ status: false, message: `Address is not an object` })

    address = JSON.parse(address)

    if (typeof address != 'object') {
        return res.status(400).send({ status: false, message: `Address is not an object` })
    }
    else {
        let { shipping, billing } = address

        if (!shipping || typeof shipping != 'object') {
            return res.status(400).send({ status: false, message: `Shipping address is either not provided or is not an object` })
        }
        if (!billing || typeof billing != 'object') {
            return res.status(400).send({ status: false, message: `Billing address is either not provided or is not an object` })
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

    let add = address.shipping
    if (!validWare.isValidPincode(add.pincode)) {
        return res.status(400).send({ status: false, message: "Provide a valid pincode in shipping address" })
    }
    if (!validWare.stReg(add.street)) {
        return res.status(400).send({ status: false, message: "Provide a valid street in shipping address" })
    }
    if (!validWare.isValidName(add.city)) { //name regex is also used for city name
        return res.status(400).send({ status: false, message: "Provide a valid city in shipping address" })
    }

    add = address.billing
    if (!validWare.isValidPincode(add.pincode)) {
        return res.status(400).send({ status: false, message: "Provide a valid pincode in billing address" })
    }
    if (!validWare.stReg(add.street)) {
        return res.status(400).send({ status: false, message: "Provide a valid street in billing address" })
    }
    if (!validWare.isValidName(add.city)) { //name regex is also used for city name
        return res.status(400).send({ status: false, message: "Provide a valid pincode in billing address" })
    }
    
    next()
}
