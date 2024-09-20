import {NextFunction, Request, Response} from "express";
import {HTTPStatusCodesEnum} from "../settings";

const users = [{login:'admin', password: 'qwerty'}]

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let base64data = buff.toString('base64')

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers['authorization']
    if (!authHeader) {
        res.send(HTTPStatusCodesEnum.Unauthorized_401)
        return;
    }
    if (authHeader && authHeader === `Basic ${base64data}`) {
        next();
    } else {
        res.send(HTTPStatusCodesEnum.Unauthorized_401)
        return;
    }

}