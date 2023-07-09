import express from 'express'

const app = express()
app.use(express.json())

// DB CONNECTION
import conn from './db/mongoDB.js'
conn();

const apiPort = 3000
app.listen(apiPort)
console.log(`API running on port ${apiPort}`)

// Routes
import routes from './routes/router.js'
routes(app)