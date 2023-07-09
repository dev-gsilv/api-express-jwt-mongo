import { userRegister, userLogin } from '../controllers/userController.js'

const userRoutes = (app) => {
    app.post('/auth/register', userRegister)
    app.post('/auth/login', userLogin)
}

export default userRoutes