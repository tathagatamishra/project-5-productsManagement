const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const router = require('./route/route')

const app = express()

app.use(express.json())
app.use(multer().any())

mongoose.set('strictQuery', true)
mongoose.connect("mongodb+srv://new_user:jk1BBWwmxQpZ31zO@cluster0.pxvwsjp.mongodb.net/group26Database")
.then(() => console.log("🥭 DB is connected "))
.catch(err => console.log(err))


app.use('/', router)

app.use('/', function (_, res) {
    res.status(404).send({ status: false, message: "Url not found 😵" })
})

app.listen(3000, () => console.log('server is 🏃 🏃 🏃'))

