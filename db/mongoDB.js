const mongoose = require('mongoose')

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

async function conn(){
    await mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPass}@teste0.oyxzwqn.mongodb.net/?retryWrites=true&w=majority`)
    .catch((e) => console.error(e))
}

module.exports = conn

