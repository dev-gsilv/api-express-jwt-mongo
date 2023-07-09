import { userRegister } from '../controllers/userController.js'

const userRoutes = (app) => {
    app.post('/auth/register', userRegister)
}

export default userRoutes