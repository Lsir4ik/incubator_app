import {Request, Response, Router} from "express";
import {RequestWithBody} from "../common/types/requests";
import {LoginInputModel} from "./types/LoginInputModel";
import {authValidation} from "./middlewares/auth.validation.middleware";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {authBearerGuard} from "./guards/access.token.guard";
import {LoginSuccessViewModel} from "./types/LoginSuccessViewModel";
import {authService} from "./auth.service";
import {routerPaths} from "../common/path/path";
import {MeViewModel} from "../users/types/MeViewModel";
import {usersQueryRepository} from "../users/user.query.repository";

export const authRouter = Router()

authRouter.post(routerPaths.auth.login, authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel>) => {
    const accessToken = await authService.loginUser(req.body)
    if (!accessToken) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    return res.status(HttpStatusCodes.OK_200).send({accessToken})
})
authRouter.get(routerPaths.auth.me, authBearerGuard, async (req: Request, res: Response<MeViewModel>) => {
    const me: MeViewModel | null = await usersQueryRepository.findMeById(req.user!.id)
    if (!me) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    return res.status(HttpStatusCodes.OK_200).send(me)

})