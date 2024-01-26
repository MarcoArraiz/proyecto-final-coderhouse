import { Router } from "express"
import { passportError, authorization } from "../utils/messagesError.js";
import { productController } from "../dao/Controllers/product.controller.js";
const productRouter = Router();

productRouter.get('/', passportError('jwt'), authorization(['user','admin','premium']), productController.getProducts);
productRouter.post('/', passportError('jwt'), authorization(['user','admin','premium']), productController.createProduct);
productRouter.get('/:id', passportError('jwt'), authorization(['user','admin','premium']), productController.getProduct);
productRouter.delete('/:id', passportError('jwt'), authorization(['user','admin','premium']), productController.deleteProduct)
productRouter.put('/:id', passportError('jwt'), authorization(['user','admin','premium']), productController.updateProduct);
productRouter.post('/mockingproducts', passportError('jwt'), authorization(['admin']), productController.createMockProduct);
productRouter.post('/mockingproducts/:number', passportError('jwt'), authorization(['admin']), productController.createMockProducts);

export default productRouter