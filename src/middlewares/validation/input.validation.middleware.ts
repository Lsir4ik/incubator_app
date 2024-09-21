import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTPStatusCodesEnum} from "../../settings";

export const inputValidationMiddleware = (req: Request,res :Response, next:NextFunction) => {
    const errors = validationResult(req).mapped()
    console.log(errors)

    if (!errors.isEmpty()) {
        res.status(HTTPStatusCodesEnum.Bad_Request_400).json({
            errorsMessages: errors.array({onlyFirstError: true})
        });
    } else {
        next()
    }
}