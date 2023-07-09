import User from '../models/User.js'

export async function userValidations(rawUser) {
    // Null fields
    if(!rawUser.name || !rawUser.email || !rawUser.password){
        return 'You must provide a valid name, email and password!'    
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
