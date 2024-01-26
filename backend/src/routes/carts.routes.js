import { Router } from "express"
import { cartController } from "../dao/Controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.get('/', cartController.getCarts);
cartRouter.post('/', cartController.createCart);
cartRouter.delete('/:cid', cartController.cleanCart);
cartRouter.put('/:cid', cartController.updateCartWithProducts);
cartRouter.get('/:id', cartController.getCart);
cartRouter.put('/:cid/products/:pid', cartController.addOrUpdateProductInCart);
cartRouter.delete('/:cid/products/:pid', cartController.removeProductbyId);


export default cartRouter; 