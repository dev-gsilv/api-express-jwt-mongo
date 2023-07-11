import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { validateNewUser, validateLogin, validateUser, validatePassword } from '../utils/validations.js'
import User from '../models/User.js'

export const registerUser = async (req, res) => {
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
            password: passwordHash,
        })

        try {
            await user.save()
            res.status(201).json({msg: 'User created!', user})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: e.message})
        }

    } catch (e) {
    res.status(400).send(e)
    }
}

export const getUser =  async (req, res) => {
    const id = req.params.id

    const user = await validateUser(await User.findById(id, "-password"))

    return res.status(user.htmlStatus).json({ msg: user.msg })
}

export const getAllUsers = async (req, res) => {
    const users = await validateUser(await User.find({}, "-password"))

    return res.status(users.htmlStatus).json({ msg: users.msg })    
}

export const updateUser = async (req, res) => {
    try {
        const {name, passwordOld, passwordNew} = req.body
        const id = req.params.id

        const userCheck = await validateUser(await User.findById(id))

        if(userCheck.htmlStatus == 404){
            return res.status(userCheck.htmlStatus).json({ msg: userCheck.msg }) 
        }

        // KEEP USER OBJ FROM DB
        const user = userCheck.msg
        
        if(passwordOld && passwordNew) {
            // PASSWORD CHECK AND UPDATE
            const isPasswordValid = await validatePassword(passwordOld, user.password)
            if(user.changePasswordAttemps >= 5){
                return res.status(422).json({ msg: 'After a limited number of failed attempts to change password, this option will be temporarily blocked. This lock lasts about an hour and will then clear on its own.'})
            }
            if(!isPasswordValid){
                user.changePasswordAttemps += 1
                await user.save()
                return res.status(422).json({ msg: 'Incorrect password!' })
            }
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(passwordNew, salt)

            user.password = passwordHash
        }
        
        if(name){
            user.name = name
        }     

        try {
            await user.save()
            res.status(201).json({msg: 'User updated!'})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

export const removeUser = async (req, res) => {
    try {
        const id = req.params.id

        const userCheck = await validateUser(await User.findById(id))

        if(userCheck.htmlStatus == 404){
            return res.status(userCheck.htmlStatus).json({ msg: userCheck.msg }) 
        }

        // KEEP USER OBJ FROM DB
        const user = userCheck.msg
        console.log(user)

        try {
            const query = await user.deleteOne({id: id})
            res.status(200).json({msg: query})
        } catch (e) {
            console.error(e)
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

export const removeWhere = async (req, res) => {
    try {
        const condition = req.body.condition

        try {
            const query = await User.deleteMany(condition)
            res.status(201).json({msg: query})
        } catch (e) {
            res.status(500).json({msg: 'Server error. Please, try again!'})
        }

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

export const login = async (req,res) => {
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
            secret
        )

        res.status(200).json({ msg: 'Authentication successful!', token })
        
    } catch (e) {
        console.log(e)
        res.status(500).json({msg: 'Server error. Please, try again!'})
    }
}