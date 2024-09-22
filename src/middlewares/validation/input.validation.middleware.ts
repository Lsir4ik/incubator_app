import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTPStatusCodesEnum} from "../../settings";
import {FieldValidationError} from "express-validator/lib/base";

export const inputValidationMiddleware = (req: Request,res :Response, next:NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(HTTPStatusCodesEnum.Bad_Request_400).json({
            errorsMessages:( errors
                .array({onlyFirstError: true}) as FieldValidationError[])
                .map((error) => {
                return {
                    message: error.msg,
                    field: error.path
                }

            })
        });
    } else {
        next()
    }
}