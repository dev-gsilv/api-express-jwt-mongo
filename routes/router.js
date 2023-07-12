import healthRoutes from './health.js'
import userRoutes from './user.js'
import productRoutes from './product.js'

const routes = app => {
    healthRoutes(app)
    userRoutes(app)
    productRoutes(app)
}

export default routes