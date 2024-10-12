import {NextFunction, Request, Response} from "express";

import {HttpStatusCodes} from "../../common/types/httpsStatusCodes";

export const users = [{login:'admin', password: 'qwerty'}]
// TODO refactor
let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data, 'utf-8')
let base64data = buff.toString('base64')

export const baseAuthGuard = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers['authorization']
    if (!authHeader) {
        res.sendStatus(HttpStatusCodes.Unauthorized_401)
        return;
    }
    if (authHeader && authHeader === `Basic ${base64data}`) {
        next();
    } else {
        res.sendStatus(HttpStatusCodes.Unauthorized_401)
        return;
    }

}