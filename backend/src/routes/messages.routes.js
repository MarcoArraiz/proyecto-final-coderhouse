import { Router } from "express"
import { messageController } from "../dao/Controllers/message.controller.js";
import { passportError, authorization } from "../utils/messagesError.js";
const messageRouter = Router();

messageRouter.get('/', passportError('jwt'), authorization(['user','premium']), messageController.getMessages);

messageRouter.post('/', passportError('jwt'), authorization(['user','premium']), messageController.createMessage);


export default messageRouter;