import {Response, Router} from "express";
import {RequestWithBody} from "../common/types/requests";
import {LoginInputModel} from "./types/LoginInputModel";
import {authValidation} from "./middlewares/auth.validation.middleware";
import {usersService} from "../users/users.service";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";

export const authRouter = Router()

authRouter.post('/', authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const isLogin = await usersService.checkCredentials(req.body)
    if (isLogin) return res.sendStatus(HttpStatusCodes.No_Content_204)
    return res.sendStatus(HttpStatusCodes.Unauthorized_401)
})