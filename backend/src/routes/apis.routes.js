import express from "express";
import userRouter from './users.routes.js';
import productRouter from './products.routes.js';
import cartRouter from './carts.routes.js';
import messageRouter from './messages.routes.js';
import sessionRouter from "./sessions.routes.js";
import orderRouter from "./orders.routes.js";

const apiRouter = express.Router();


apiRouter.use('/users', userRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/carts', cartRouter)
apiRouter.use('/message', messageRouter)
apiRouter.use('/sessions', sessionRouter)
apiRouter.use('/orders', orderRouter)

export default apiRouter;