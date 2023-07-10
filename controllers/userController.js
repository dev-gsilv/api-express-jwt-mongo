import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateNewUser, validateLogin, validateUser } from '../utils/validations.js'
import User from '../models/User.js'

export const userRegister = async (req, res) => {
    try {
        const {name, email, password, passwordConfirmation} = req.body

        const newUser = {name, email, password, passwordConfirmation}
        const fail = await validateNewUser(newUser)
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

export const userLogin = async (req,res) => {
    const { email, password } = req.body

    const rawUser = {email, password}
    const fail = await validateLogin(rawUser)
    if(fail){
        return res.status(422).json({msg: fail})
    }

    try {
        const secret = process.env.SECRET
        const user = await User.findOne({ email:rawUser.email })
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )

        res.status(200).json({ msg: 'Authentication successful!', token })
        
    } catch (e) {
        console.log(e)
        res.status(500).json({msg: 'Server error. Please, try again!'})
    }
}

export const userProfile =  async (req, res) => {
    const id = req.params.id

    const user = await validateUser(id)
    return res.status(user.htmlStatus).json({ msg: user.msg })
}

export function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
  
    if (!token) return res.status(401).json({ msg: "Access denied!" })
  
    try {
      const secret = process.env.SECRET
  
      jwt.verify(token, secret)
  
      next();
    } catch (err) {
      res.status(400).json({ msg: "Invalid token!" })
    }
  }