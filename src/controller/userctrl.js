const userModel = require('../model/usermodel')
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


exports.updateUser = async (req, res) => {
    try {

        let userId = req.params.userId
        let user = await userModel.findById(userId)
        if (!user) return res.status(404).send({ status: false, message: "User not found 😵‍💫😭" })


        let image = req.files.profileImage

        if (image) { let profileImage = await uploadFile(image[0]) }


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


        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true })

        return res.status(201).send({ status: true, message: "Your profile updated successfully 😃", data: updatedUser })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}