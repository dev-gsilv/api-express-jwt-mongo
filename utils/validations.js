import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const response = { htmlStatus: 200, msg: ''}

export async function validatePassword(givenPassword, hashPassword) {
    return await bcrypt.compare(givenPassword, hashPassword)
}

export async function validateNewUser(rawUser) {
    // Null fields
    if(!rawUser.name){
        return 'You must provide a valid name!'    
    }
    if(!rawUser.email){
        return 'You must provide a valid email!'    
    }
    if(!rawUser.password || rawUser.password.length < 8){
        return 'You must provide a valid password!'    
    }
    // Password confirmation
    if(rawUser.password !== rawUser.passwordConfirmation){
        return 'Password confirmation does not match!'
    }
    // Duplicated user
    const userExists = await User.findOne({ email: rawUser.email })
    if(userExists){
        return 'Email already registered!'
    }
}

export async function validateLogin(userParam) {
    // Null fields
    if(!userParam.email){
        return 'You must provide a valid email!'    
    }
    if(!userParam.password){
        return 'You must provide a valid password!'    
    }
    // Valid user
    const userDB = await User.findOne({ email: userParam.email })
    if(!userDB){
        return 'Invalid email or password!'
    }
    // Valid password
    const result = await validatePassword(userParam.password, userDB.password)
    if( !result ){
        return 'Invalid email or password!'
    }
}

export async function validateUser(queryResponse) {
    const callBack = Object.create(response)

    if(queryResponse === undefined || queryResponse === null || queryResponse.length == 0){
        callBack.htmlStatus = 404
        callBack.msg = 'No user was found!'
        return callBack
    } else {
        callBack.htmlStatus = 200
        callBack.msg = queryResponse
        return callBack
    }
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