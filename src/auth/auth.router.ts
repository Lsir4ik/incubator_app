import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithQuery} from "../common/types/requests";
import {LoginInputModel} from "./types/LoginInputModel";
import {
    authValidation,
    registrationConfirmationValidation,
    registrationValidation,
    resendingEmailValidation
} from "./middlewares/auth.validation.middleware";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {authBearerGuard} from "./guards/access.token.guard";
import {LoginSuccessViewModel} from "./types/LoginSuccessViewModel";
import {authService} from "./auth.service";
import {routerPaths} from "../common/path/path";
import {MeViewModel} from "../users/types/MeViewModel";
import {usersQueryRepository} from "../users/user.query.repository";
import {RegistrationConfirmationCodeModel} from "./types/RegistrationConfirmationCodeModel";
import {UserInputModel} from "../users/types/UserInputModel";
import {RegistrationEmailResending} from "./types/RegistrationEmailResending";

export const authRouter = Router()

authRouter.post(routerPaths.auth.login, authValidation, async (req: RequestWithBody<LoginInputModel>, res: Response<LoginSuccessViewModel>) => {
    const accessToken = await authService.loginUser(req.body)
    if (!accessToken) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
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
authRouter.get(routerPaths.auth.me, authBearerGuard, async (req: Request, res: Response<MeViewModel>) => {
    const me: MeViewModel | null = await usersQueryRepository.findMeById(req.user!.id)
    if (!me) return res.sendStatus(HttpStatusCodes.Unauthorized_401)
    return res.status(HttpStatusCodes.OK_200).send(me)
})