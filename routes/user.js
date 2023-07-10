import { userRegister, userLogin, userProfile, checkToken } from '../controllers/userController.js'

const userRoutes = (app) => {
    app.post('/auth/register', userRegister)
    app.post('/auth/login', userLogin)
    app.get('/user/:id', checkToken, userProfile)
}

export default userRoutes