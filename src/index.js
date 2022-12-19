const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const router = require('./route/route')

const app = express()

app.use(express.json())
app.use(multer().any())

mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://new_user:jk1BBWwmxQpZ31zO@cluster0.pxvwsjp.mongodb.net/group26Database")
.then(() => console.log("MDB is connected"))
.catch(err => console.log(err))


app.use('/', router)

app.use('/', function (req, res) {
    res.status(404).send({ status: false, message: "Url not found !!!" })
})

app.listen(3000, () => console.log('server is 🏃 🏃 🏃'))
