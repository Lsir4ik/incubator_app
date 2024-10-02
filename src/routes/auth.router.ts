import {Response, Router} from "express";
import {RequestWithBody} from "../models/types";
import {LoginInputModel} from "../models/login/LoginInputModel";
import {authValidation} from "../middlewares/validation/auth/auth.validation.middleware";
import {HTTPStatusCodesEnum} from "../settings";
import {usersService} from "../service/users.service";

export const authRouter = Router()

authRouter.post('/', authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const isLogin = await usersService.checkCredentials(req.body)
    if (isLogin) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
})