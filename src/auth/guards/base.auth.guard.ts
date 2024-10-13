import {NextFunction, Request, Response} from "express";

import {HttpStatusCodes} from "../../common/types/httpsStatusCodes";

export const ADMIN_LOGIN = 'admin'
export const ADMIN_PASS = 'qwerty'
export const ADMIN_TOKEN = `Basic ` + Buffer.from(`${ADMIN_LOGIN}:${ADMIN_PASS}`).toString('base64')

export const baseAuthGuard = (req: Request, res: Response, next: NextFunction) => {
    let authHeader = req.headers['authorization']
    if (!authHeader) {
        res.sendStatus(HttpStatusCodes.Unauthorized_401)
        return;
    }
    if (authHeader && authHeader === ADMIN_TOKEN) {
        next();
    } else {
        res.sendStatus(HttpStatusCodes.Unauthorized_401)
        return;
    }

}