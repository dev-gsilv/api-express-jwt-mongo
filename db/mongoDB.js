import mongoose from "mongoose"
import 'dotenv/config'

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

export default async function conn(){
    await mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPass}@teste0.oyxzwqn.mongodb.net/?retryWrites=true&w=majority`)
    .catch((e) => console.error(e))
}


