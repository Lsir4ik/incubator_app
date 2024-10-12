import {body} from "express-validator";
import {inputValidationMiddleware} from "../../common/validation/input.validation.middleware";

const loginValidation = body('login').notEmpty().isString().trim().isLength({min:3, max:10}).matches('^[a-zA-Z0-9_-]*$')
const passwordValidation = body('password').notEmpty().isString().trim().isLength({min:6, max:20})
const emailValidation = body('email').notEmpty().isString().isEmail()

export const createUserValidation = [
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware
]