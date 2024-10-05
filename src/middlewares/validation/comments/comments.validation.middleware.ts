import {body} from "express-validator";
import {inputValidationMiddleware} from "../input.validation.middleware";

const contentValidator = body('content').notEmpty().isString().trim().isLength({ min: 20, max: 300 })

export const createCommentValidation = [
    contentValidator,
    inputValidationMiddleware
]