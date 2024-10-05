import {NextFunction, Request, Response} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {jwtService} from "../application/jwt.service";
import {usersService} from "../service/users.service";

export const users = [{login:'admin', password: 'qwerty'}]

// Barer auth
export const authBarerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
    }
    res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
    return;
}

// Basic ath
let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data, 'utf-8')
let base64data = buff.toString('base64')

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers['authorization']
    if (!authHeader) {
        res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
        return;
    }
    if (authHeader && authHeader === `Basic ${base64data}`) {
        next();
    } else {
        res.sendStatus(HTTPStatusCodesEnum.Unauthorized_401)
        return;
    }

}