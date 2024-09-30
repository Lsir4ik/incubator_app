import {Response, Router} from "express";
import {RequestWithBody} from "../models/types";
import {LoginInputModel} from "../models/login/LoginInputModel";
import {authValidation} from "../middlewares/validation/auth/auth.validation.middleware";
import {HTTPStatusCodesEnum} from "../settings";
import {usersService} from "../service/users.service";

export const authRouter = Router()

authRouter.post('/', authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    // TODO Note: If the error should be in the BLL, for example, "the email address is not unique", do not try to mix this error with input validation errors in the middleware, just return one element in the errors array
    const isLogin = await usersService.checkCredentials(req.body)
    if (isLogin) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
})