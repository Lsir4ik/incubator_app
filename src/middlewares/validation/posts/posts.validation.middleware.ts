import {body, CustomValidator} from "express-validator";
import {blogsRepository} from "../../../repositories/Mongo/blogs.db.repository";
import {inputValidationMiddleware} from "../input.validation.middleware";

const customIsValidBlogId: CustomValidator = async (idOfBlog: string): Promise<void> => {
    const foundBlog = await blogsRepository.findBlogById(idOfBlog)
    // return !!foundBlog
    if (!foundBlog) {
        throw new Error("Blog not found");
    }
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