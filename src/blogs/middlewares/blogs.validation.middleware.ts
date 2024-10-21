import {body} from "express-validator";
import {inputValidationMiddleware} from "../../common/validation/input.validation.middleware";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../../posts/middlewares/posts.validation.middleware";

const nameValidation = body('name').notEmpty().isString().trim().isLength({max: 15})
const descriptionValidation = body('description').notEmpty().isString().trim().isLength({max: 500})
const websiteUrlValidation = body('websiteUrl').notEmpty().isString().trim().isLength({max: 100}).isURL()

export const createBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware
]

export const updateBlogValidation = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware
]

export const createPostForSpecificBlogValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware
]