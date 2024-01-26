import { Router } from "express"
import { passportError, authorization } from "../utils/messagesError.js";
import { orderController } from "../dao/Controllers/order.controller.js";
const orderRouter = Router();

orderRouter.get('/:id', passportError('jwt'), authorization(['user','premium']), orderController.getOrderById);
orderRouter.post('/:cid', passportError('jwt'), authorization(['user','premium']), orderController.createOrder);
orderRouter.put('/:id', passportError('jwt'), authorization(['user','premium']), orderController.updateOrderStatusById);

export default orderRouter;

