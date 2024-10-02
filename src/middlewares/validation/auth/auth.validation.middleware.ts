import {body} from "express-validator";
import {inputValidationMiddleware} from "../input.validation.middleware";

const loginOrEmailValidation = body('loginOrEmail').notEmpty().isString()
const passwordValidation = body('password').notEmpty().isString()

export const authValidation = [
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware
]