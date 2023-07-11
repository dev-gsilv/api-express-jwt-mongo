import { login, registerUser, getUser, getAllUsers, updateUser, removeUser, removeWhere  } from '../controllers/userController.js'
import { checkToken } from '../utils/validations.js'

const userRoutes = (app) => {
    // PUBLIC
    app.post('/auth/register', registerUser)
    app.post('/auth/login', login)

    // PRIVATE
    app.get('/user/:id', checkToken, getUser)
    app.get('/user/', checkToken, getAllUsers)
    app.put('/user/:id', checkToken, updateUser)
    app.delete('/user/:id', checkToken, removeUser)
    app.delete('/user/', checkToken, removeWhere)
}

export default userRoutes