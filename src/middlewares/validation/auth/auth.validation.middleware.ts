import {body} from "express-validator";
import {inputValidationMiddleware} from "../input.validation.middleware";

const loginOrEmailValidation = body().notEmpty().isString()
const passwordValidation = body().notEmpty().isString()

export const authValidation = [
    loginOrEmailValidation,
    passwordValidation,
    inputValidationMiddleware
]