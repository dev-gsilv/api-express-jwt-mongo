import bcrypt from 'bcrypt'
import User from '../models/User.js'

export async function validateNewUser(rawUser) {
    // Null fields
    if(!rawUser.name){
        return 'You must provide a valid name!'    
    }
    if(!rawUser.email){
        return 'You must provide a valid email!'    
    }
    if(!rawUser.password){
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

export async function validateLogin(user) {
    // Null fields
    if(!user.email){
        return 'You must provide a valid email!'    
    }
    if(!user.password){
        return 'You must provide a valid password!'    
    }
    // Valid user
    const userExists = await User.findOne({ email: user.email })
    if(!userExists){
        return 'Invalid email or password!'
    }
    // Valid password
    const checkPassword = await bcrypt.compare(user.password, userExists.password)
    if(!checkPassword){
        return 'Invalid email or password!'
    }
}
