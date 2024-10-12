import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {FieldValidationError} from "express-validator/lib/base";
import {HttpStatusCodes} from "../types/httpsStatusCodes";

export const inputValidationMiddleware = (req: Request,res :Response, next:NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(HttpStatusCodes.Bad_Request_400).json({
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