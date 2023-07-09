require('dotenv').config()
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

const apiPort = 3000
app.listen(apiPort)
console.log(`API running on port ${apiPort}`)

// DB CONNECTION
const conn = require("./db/mongoDB");
conn();

// Routes
const routes = require('./routes/router')
app.use('/api', routes)
