import {CustomValidation} from "express-validator/lib/context-items";
import {body, CustomValidator} from "express-validator";
import {blogsRepository} from "../../../repositories/Local/blogs.memory.repository";
import {BlogViewModel} from "../../../models/blogs/BlogViewModel";
import {inputValidationMiddleware} from "../input.validation.middleware";

const customIsValidBlogId: CustomValidator = (value: string): boolean => {
    const blog: BlogViewModel | undefined = blogsRepository.findBlogById(value)
    return !!blog
}

const titleValidation = body('title').notEmpty().isString().trim().isLength({max: 30})
const shortDescriptionValidation = body('shortDescription').notEmpty().isString().trim().isLength({max: 100})
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000})
const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(customIsValidBlogId)

export const createPostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware
]

export const updatePostValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware
]