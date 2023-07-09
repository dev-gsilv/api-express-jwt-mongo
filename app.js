require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())

// MONGO ATLAS CONNECTION
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPass}@teste0.oyxzwqn.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3000)
        console.log('API running on port 3000')
    })
    .catch((e) => console.error(e))

// Routes
const routes = require('./routes/router')
app.use('/api', routes)
