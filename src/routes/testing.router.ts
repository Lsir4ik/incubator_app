import {Request, Response, Router} from "express";
import {HTTPStatusCodesEnum, SETTINGS} from "../settings";

export const testingRouter = Router()

testingRouter.delete(SETTINGS.PATH.TESTING, (req: Request, res: Response) => {
    res.sendStatus(HTTPStatusCodesEnum.No_Content_204);
})