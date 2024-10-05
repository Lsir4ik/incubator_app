import {Router} from "express";
import {authBarerMiddleware} from "../middlewares/authorization.middleware";

export const commentsRouter = Router();

commentsRouter.put('/:id', authBarerMiddleware, async () => {})
commentsRouter.delete('/:id', authBarerMiddleware, async () => {})
commentsRouter.get('/:id', async () => {})