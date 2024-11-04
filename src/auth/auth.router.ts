import {Request, Response, Router} from "express";
import {RequestWithBody} from "../common/types/requests";
import {LoginInputModel} from "./types/LoginInputModel";
import {
    authValidation,
    registrationConfirmationValidation,
    registrationValidation,
    resendingEmailValidation
} from "./middlewares/auth.validation.middleware";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {authBearerGuard} from "./guards/bearer/bearer.auth.guard";
import {LoginSuccessViewModel} from "./types/LoginSuccessViewModel";
import {authService} from "./auth.service";
import {routerPaths} from "../common/path/path";
import {MeViewModel} from "../users/types/MeViewModel";
import {usersQueryRepository} from "../users/user.query.repository";
import {RegistrationConfirmationCodeModel} from "./types/RegistrationConfirmationCodeModel";
import {UserInputModel} from "../users/types/UserInputModel";
import {RegistrationEmailResending} from "./types/RegistrationEmailResending";
import {ResultStatus} from "../common/types/result.type";
import {TokensModel} from "./types/TokensModel";

export const authRouter = Router()

authRouter.post(routerPaths.auth.login, authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel>) => {
    const loginResult = await authService.logInUser(req.body)
    if (!loginResult) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    const {accessToken, refreshToken} = loginResult
    res.cookie('refreshToken', refreshToken, {httpOnly: true,secure: true})
    return res.status(HttpStatusCodes.OK_200).send({accessToken})
})
authRouter.post(routerPaths.auth.refreshToken, async (req: Request, res: Response<LoginSuccessViewModel>) => {
    const verifyRefreshTokenResult = await authService.refreshJwtTokens(req.cookies.refreshToken)
    if (verifyRefreshTokenResult.status !== ResultStatus.Success) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    const {accessToken, refreshToken} = verifyRefreshTokenResult.data as TokensModel
    res.cookie('refreshToken', refreshToken, {httpOnly: true,secure: true})
    return res.status(HttpStatusCodes.OK_200).send({accessToken})
})
authRouter.post(routerPaths.auth.registrationConfirmation, registrationConfirmationValidation, async (req: RequestWithBody<RegistrationConfirmationCodeModel>,res: Response) => {
    const confirmResult = await authService.confirmRegistration(req.body.code)
    if (!confirmResult.data) return res.status(HttpStatusCodes.Bad_Request_400).json(confirmResult.formatError)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
authRouter.post(routerPaths.auth.registration, registrationValidation, async (req:RequestWithBody<UserInputModel>,res: Response) => {
    const registrationResult = await authService.registerUser(req.body)
    if(!registrationResult.data) return res.status(HttpStatusCodes.Bad_Request_400).json(registrationResult.formatError)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
authRouter.post(routerPaths.auth.registrationEmailResending, resendingEmailValidation, async (req:RequestWithBody<RegistrationEmailResending>,res: Response) => {
    const resendingEmailConfirmationResult = await authService.registrationEmailResending(req.body.email)
    if (!resendingEmailConfirmationResult.data) return res.status(HttpStatusCodes.Bad_Request_400).json(resendingEmailConfirmationResult.formatError)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
authRouter.post(routerPaths.auth.logout, async (req: Request, res: Response) => {
    const verifyRefreshTokenResult = await authService.logOutUser(req.cookies.refreshToken)
    if (!verifyRefreshTokenResult.data) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
authRouter.get(routerPaths.auth.me, authBearerGuard, async (req: Request, res: Response<MeViewModel>) => {
    const me = await usersQueryRepository.findMeById(req.user!.id)
    if (!me) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    return res.status(HttpStatusCodes.OK_200).send(me)
})