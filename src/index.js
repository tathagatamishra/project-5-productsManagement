const express = require('express')
const mongoose = require('mongoose')
const router = require('./route/route')

const app = express()

app.use(express.json())

app.use('/', router)


app.listen(3000, () => console.log('server is 🏃 🏃 🏃'))
