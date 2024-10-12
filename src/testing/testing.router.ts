import {Request, Response, Router} from "express";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {db} from "../db";

export const testingRouter = Router()

testingRouter.delete('/', async (req: Request, res: Response) => {
    await db.drop()
    res.sendStatus(HttpStatusCodes.No_Content_204);
})