import healthRoutes from './health.js'
import userRoutes from './user.js'

const routes = app => {
    healthRoutes(app)
    userRoutes(app)
}

export default routes