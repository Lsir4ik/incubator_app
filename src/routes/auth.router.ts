import {Response, Request, Router} from "express";
import {RequestWithBody} from "../types/types";
import {LoginInputModel} from "../models/login/LoginInputModel";
import {authValidation} from "../middlewares/validation/auth/auth.validation.middleware";
import {HTTPStatusCodesEnum} from "../settings";
import {usersService} from "../service/users.service";
import {authBarerMiddleware} from "../middlewares/authorization.middleware";
import {jwtService} from "../application/jwt.service";
import {MeViewModel} from "../models/users/MeViewModel";

export const authRouter = Router()

authRouter.post('/login', authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response) => {
    const foundUser = await usersService.checkCredentials(req.body)
    if (foundUser) {
        const token = await jwtService.createJWT(foundUser)
        res.status(HTTPStatusCodesEnum.OK_200).send(token)
    } else res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
})
authRouter.get('/me', authBarerMiddleware, async (req: Request, res: Response) => {
    const meInfo: MeViewModel | null = await usersService.findMeById(req.user!.id)
    if (meInfo) return res.status(HTTPStatusCodesEnum.OK_200).send(meInfo)
    return res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
})