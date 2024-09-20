import {body} from "express-validator";
import {inputValidationMiddleware} from "../input.validation.middleware";

const nameValidation = body('name').notEmpty().isString().trim().isLength({max: 15})
const descriptionValidation = body('description').notEmpty().isString().trim().isLength({max: 500})
const webSiteUrlValidation = body('webSiteUrl').isURL()

export const createBlogValidation = [
    nameValidation,
    descriptionValidation,
    webSiteUrlValidation,
    inputValidationMiddleware
]

export const updateBlogValidation = [
    nameValidation,
    descriptionValidation,
    webSiteUrlValidation,
    inputValidationMiddleware
]