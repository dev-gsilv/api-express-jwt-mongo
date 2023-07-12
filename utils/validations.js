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

    const re = /^[a-z0-9.!#$%&'*+\-/=?^_`{|]+@[a-z0-9-]+\.[a-z]+(?:\.[a-z]+)*$/gi
    const reCheck = rawUser.email.match(re)
    if(!rawUser.email || reCheck === null ){
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
    if(!userParam.email ){
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

export function validateNewProduct(product) {
    const arr =  Object.values(product)    
    for(let i = 0; i < arr.length; i++ ){
        if(!arr[i] || arr[i] === null || arr[i] === undefined || arr[i] === ''){
            return 'You must provide valid information for name, description and value fields!'
        }
    }
}

export async function productExist(queryResponse) {
    const callBack = Object.create(response)

    if(queryResponse === undefined || queryResponse === null || queryResponse.length == 0){
        callBack.htmlStatus = 404
        callBack.msg = 'No product was found!'
        return callBack
    } else {
        callBack.htmlStatus = 200
        callBack.msg = queryResponse
        return callBack
    }
}

//  CAST EMPTY STRING TO UNDEFINED, TO COMPLY WITH MONGOOSE MODEL CLASS VALIDATOR
export const modifiedCast = (string) => {
    if(string === ''){
        string = undefined
    }
return string
}

// FORMAT LONG DECIMALS TO 2 DIGITS
export const roundOff = (v) => {
    // JS WON'T SAVE 0 VALUES ON THE RIGHT (E.G 1.00 => 1; 1.10 => 1.1)
    let fix = v.toString()
    if(!v.match(/\./)){
        fix = v.concat('.', '00')
        fix = Number(fix)
        console.log('if: '+fix, typeof(fix))
        return fix
    }
    const arrNum = v.split('.')
    const decimalCount = arrNum[1].length
    switch(decimalCount){
    case 1:
        fix = arrNum[0].concat('.', arrNum[1]).concat('0')        
        fix = Number(fix)
        return fix
    default:
        let decimal = arrNum[1].substring(0, 2)    
        fix = arrNum[0].concat('.', decimal)
        fix = Number(fix)
        return fix
    }
}

export const toBrlCurrency = (v) => {
    const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
    return money
}