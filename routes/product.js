import { getProduct, getAllProducts, registerProduct, updateProduct, removeProduct, removeWhere} from '../controllers/productController.js'
import { checkToken } from '../utils/validations.js'

const productRoutes = (app) => {
    // PUBLIC
    app.get('/product/:id', getProduct)
    app.get('/product/', getAllProducts)

    // PRIVATE
    app.post('/product/register', checkToken, registerProduct)
    app.put('/product/:id', checkToken, updateProduct)
    app.delete('/product/:id', checkToken, removeProduct)
    app.delete('/product/', checkToken, removeWhere)
}

export default productRoutes