import {body} from "express-validator";
import {inputValidationMiddleware} from "../../common/validation/input.validation.middleware";

const loginOrEmailValidation = body('loginOrEmail').notEmpty().isString()
const passwordAuthValidation = body('password').notEmpty().isString()

const loginRegistrationValidation = body('login').notEmpty().isString().trim().isLength({min:3, max:10}).matches('^[a-zA-Z0-9_-]*$')
const passwordRegistrationValidation = body('password').notEmpty().isString().trim().isLength({min:6, max:20})
const emailValidation = body('email').notEmpty().isString().isEmail()

const codeValidation = body('code').notEmpty().isString()

export const authValidation = [
    loginOrEmailValidation,
    passwordAuthValidation,
    inputValidationMiddleware
]

export const resendingEmailValidation = [
    emailValidation,
    inputValidationMiddleware
]

export const registrationValidation = [
    loginRegistrationValidation,
    passwordRegistrationValidation,
    emailValidation,
    inputValidationMiddleware
]

export const registrationConfirmationValidation = [
    codeValidation,
    inputValidationMiddleware
]