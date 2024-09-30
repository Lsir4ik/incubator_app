import {body} from "express-validator";
import {inputValidationMiddleware} from "../input.validation.middleware";

const loginValidation = body().notEmpty().isString().trim().isLength({min:3, max:10}).matches('^[a-zA-Z0-9_-]*$')
const passwordValidation = body().notEmpty().isString().trim().isLength({min:6, max:20})
const emailValidation = body().notEmpty().isString().isEmail()

export const createUserValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware
]