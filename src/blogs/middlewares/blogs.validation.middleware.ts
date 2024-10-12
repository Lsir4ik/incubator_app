import {body} from "express-validator";
import {inputValidationMiddleware} from "../../common/validation/input.validation.middleware";
import {contentValidation, shortDescriptionValidation, titleValidation} from "../../posts/middlewares/posts.validation.middleware";

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

export const createPostForSpecificBlogValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware
]