import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userValidations } from '../utils/validations.js'
import User from '../models/User.js'

export const userRegister = async (req, res) => {
    try {
        const {name, email, password, passwordConfirmation} = req.body

        const rawUser = {name, email, password, passwordConfirmation}
        const fail = await userValidations(rawUser)
        if(fail){
            return res.status(422).json({msg: fail})
        }

        // PASSWORD CREATION
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // OBJECT USER
        const user = new User({
            name,
            email,
            password: passwordHash
        })

        try {
            await user.save()
            res.status(201).json({msg: 'User created!'})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
    res.status(400).send(e)
    }
}