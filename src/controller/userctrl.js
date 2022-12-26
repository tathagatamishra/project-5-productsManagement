const userModel = require('../model/usermodel')
const AWS = require('./awsS3')

const validWare = require('../middleware/validware')
const { isValidEmail, isValidObjectId } = validWare

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let nameValid = /^[a-zA-Z0-9\ ]{1,20}$/


exports.userReg = async (req, res) => {
    try {

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
            if (unique.email == email) return res.status(400).send({ status: false, message: "This email is already taken 😕" })
            if (unique.phone == phone) return res.status(400).send({ status: false, message: "This mobile number is already taken 😕" })
        }

        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "Provide a valid password" })
        }

        //todo------------

        if (!address) return res.status(400).send({ status: false, message: 'Address is not present' })

        if (!address.startsWith('{') || !address.endsWith('}')) return res.status(400).send({ status: false, message: `Address is not an object` })

        address = JSON.parse(address)
        req.body.address = address

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

        //todo user data creation part ---

        let data = req.body
        let image = req.files

        //! password encrypting --
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        req.body.password = hashPassword

        if (!image || image == undefined || image.length == 0) return res.status(400).send({ status: false, message: "Provide a profile image" })

        //! creating s3 link --
        if (image && image.length == 1) {

            if (image[0].mimetype.indexOf('image') == -1) return res.status(400).send({ status: false, message: "Provide an image file" })

            let imageLink = await AWS.uploadFile(image[0])

            // if (!imageLink) return res.status(400).send({ status: false, message: "Something went wrong, try again after sometime" })

            data.profileImage = imageLink
        }

        const createdData = await userModel.create(data)
        res.send({ status: true, message: "Your account created successfully 😃", data: createdData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Internal Server Error!", error: err.message })
    }
}

exports.userLogin = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide email and password." })

        let { email, password } = data
        email = email.toLowerCase()

        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please enter a valid Email" })

        if (!password) return res.status(400).send({ status: false, message: "password is required" })

        let userData = await userModel.findOne({ email: email })
        if (!userData) return res.status(404).send({ status: false, message: "Email not found" })
        
        let hashPassword = userData.password

        const result = await bcrypt.compare(password, hashPassword)
        if (!result) return res.status(400).send({ status: false, message: "Entered password is incorrect" })

        let token = jwt.sign(

            { userId: userData._id.toString() },
            "the-secret-key",
            { expiresIn: '30m' }
        )

        res.setHeader('Authorization', token)
        return res.status(200).send({ status: true, message: "User login successful", data: { userId: userData._id, token: token } });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

exports.getUser = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        const checkId = await userModel.findOne({ _id: userId })
        if (!checkId) {
            return res.status(400).send({ status: false, message: "User not found" })
        }
        return res.status(200).send({ status: true, message: "User profile details", data: checkId })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        //! checking if user id is present in db or not
        let userId = req.params.userId
        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: "User not found 😵‍💫😭" })


        //! need jpg/png to update profile pic, only then link will generate
        let data = req.body
        let image = req.files

        if ((image == undefined || image.length == 0) && Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Nothing to update 😜" })

        if (image.length == 1) {

            if (image[0].mimetype.split('/')[0] != 'image') return res.status(400).send({ status: false, message: "Provide a jpeg or png file 📷" })

            let imageLink = await AWS.uploadFile(image[0])
            req.body.profileImage = imageLink
        }

        //! performing validation on these fields
        let { fname, lname, email, phone, password, address } = data

        if (fname) {
            if (fname == null || fname.trim() == '') return res.status(400).send({ status: false, message: "First name can not be empty" })
            if (!fname.match(nameValid)) return res.status(400).send({ status: false, message: "Enter a valid first name" })
        }
        if (lname) {
            if (lname == null || lname.trim() == '') return res.status(400).send({ status: false, message: "Last name can not be empty" })
            if (!lname.match(nameValid)) return res.status(400).send({ status: false, message: "Enter a valid last name" })
        }

        if (email) email = email.trim()
        if (email) {
            if (email == null || email == '') return res.status(400).send({ status: false, message: "Email can not be empty" })
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Email id is not valid" })
        }

        if (phone) phone = phone.trim()
        if (phone) {
            if (phone == null || phone == '') return res.status(400).send({ status: false, message: "Phone number can not be empty" })
        }

        let unique = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] })
        if (unique) {
            if (unique.email == email) return res.status(400).send({ status: false, message: "This email is already taken 😕" })
            if (unique.phone == phone) return res.status(400).send({ status: false, message: "This mobile number is already taken 😕" })
        }

        if (password) {
            if (password.length < 8 || password.length > 15)
                return res.status(400).send({ status: false, message: "Password length must be between 8-15" })
        }

        //!=================================================
        if (address) address = address.trim()
        if (address) {

            if (address == null || address == '') return res.status(400).send({ status: false, message: "Address can not be empty" })

            if (!address.startsWith('{') && !address.endsWith('}')) return res.status(400).send({ status: false, message: `Address is not an object` })

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
        }
        //!=================================================


        //! updating user data in db
        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })

        return res.status(201).send({ status: true, message: "Your profile updated successfully 😃", data: updatedUser })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
