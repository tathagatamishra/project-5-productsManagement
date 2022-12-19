const userModel = require('../model/usermodel')
const validware = require('../middleware/validware')
const { isValidEmail } = validware

const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')


let nameValid = /^[a-zA-Z\ ]{1,20}$/


AWS.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async (file) => {

    return new Promise((resolve, reject) => {

        let s3 = new AWS.S3({ apiVersion: '2006-03-01' })

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "shopping-cart-user/" + file.originalname,
            Body: file.buffer
        }

        s3.upload(uploadParams, function (err, data) {

            if (err) return reject({ "error": err })

            return resolve(data.Location)
        })
    })
}


exports.userLogin = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide email and password." })
        const { email, password } = data

        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please enter a valid Email" })

        if (!password) return res.status(400).send({ status: false, message: "password is required" })

        let userData = await userModel.findOne({ email: email, password: password })
        if (!userData) return res.status(400).send({ status: false, message: "Entered email or password is incorrect" })

        let token = jwt.sign({
            userId: userData._id.toString()
        }, "the-secret-key", { expiresIn: '30m' })

        res.setHeader('Authorization', token)
        return res.status(200).send({ status: true, message: "User login successfull", data: { userId: userData._id, token: token } });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


exports.updateUser = async (req, res) => {
    try {
        //! checking if user id is present in db or not
        let userId = req.params.userId
        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: "User not found 😵‍💫😭" })
        
        //! need jpg/png to update profile pic, only then link will generate
        let image = req.files
        if (image) {
            
            if (image) return res.status(400).send({ status: false, message: "Provide a jpeg/png file 📷" })
            
            let imageLink = await uploadFile(image[0])
            req.body.profileImage = imageLink
        }
        
        //! performing validation on these fields
        let data = req.body
        let { fname, lname, email, phone, password } = data

        if (fname) if (fname.trim() == '' || fname.match(nameValid)) return res.status(400).send({ status: false, message: "First name can not be empty" })

        if (lname) if (lname.trim() == '' || lname.match(nameValid)) return res.status(400).send({ status: false, message: "Last name can not be empty" })


        if (email) email = email.trim()
        if (email == '') return res.status(400).send({ status: false, message: "Email can not be empty" })

        if (phone) phone = phone.trim()
        if (phone == '') return res.status(400).send({ status: false, message: "Phone number can not be empty" })

        let unique = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] })
        if (unique) {
            if (user.email == email) return res.status(400).send({ status: false, message: "This email is already taken 😕" })
            if (user.phone == phone) return res.status(400).send({ status: false, message: "This mobile number is already taken 😕" })
        }

        if (password) {
            if (password.length < 8 || password.length > 15)
                return res.status(400).send({ status: false, message: "Password length must be between 8-15" })
        }

        //! updating user data in db
        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })

        return res.status(201).send({ status: true, message: "Your profile updated successfully 😃", data: updatedUser })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


