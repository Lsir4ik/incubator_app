import {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "../../common/types/httpsStatusCodes";
import {jwtService} from "../../common/adapters/jwt.service";
import {usersRepository} from "../../users/users.repository";
import {IdType} from "../../common/types/id";


export const authBearerGuard = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(HttpStatusCodes.Unauthorized_401)

    const token = req.headers.authorization.split(' ')[1];

    const payload = await jwtService.verifyToken(token)
    if (!payload) return res.sendStatus(HttpStatusCodes.Unauthorized_401)

    const isUserExist = await usersRepository.doesExistById(payload.userId)
    if (isUserExist) {
        req.user = {id: payload.userId} as IdType
        return next()
    } else return res.sendStatus(HttpStatusCodes.Unauthorized_401)
}