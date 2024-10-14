import {body} from "express-validator";
import {inputValidationMiddleware} from "../../common/validation/input.validation.middleware";

const contentValidator = body('content').notEmpty().isString().trim().isLength({ min: 20, max: 300 })

export const createCommentValidation = [
    contentValidator,
    inputValidationMiddleware
]
export const updateCommentValidator = [
    contentValidator,
    inputValidationMiddleware
]