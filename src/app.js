const express = require('express')
const router = require('./router')
const cors = require("cors")

const app  = express()

app.use(cors())
app.use(express.json())

//Toda requisição vai cair dentro do Router
app.use(router)

module.exports = app
