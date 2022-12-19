const userModel = require('../model/usermodel')
const validware = require('../middleware/validware')
const { isValidEmail } = validware
const jwt = require('jsonwebtoken')



const userLogin = async function (req, res) {
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


module.exports = { userLogin }