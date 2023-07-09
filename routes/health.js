import { check } from '../controllers/healthController.js'

const healthRoutes = (app) => {
    app.get('/api/health', check)
}

export default healthRoutes