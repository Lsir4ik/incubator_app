import {Request, Response, response, Router} from "express";
import {HTTPStatusCodesEnum, SETTINGS} from "../settings";
import {blogsRepository} from "../repositories/Local/blogs.memory.repository";
import {authMiddleware} from "../middlewares/authorization.middleware";
import {createBlogValidation, updateBlogValidation} from "../middlewares/validation/blogs/blogs.validation.middleware";

export const blogsRouter = Router()

blogsRouter.get(SETTINGS.PATH.BLOGS, (req: Request, res: Response) => {
    const blogs = blogsRepository.findAllBlogs()
    res.status(HTTPStatusCodesEnum.OK_200).send(blogs)
})
blogsRouter.post(SETTINGS.PATH.BLOGS, authMiddleware, createBlogValidation, (req: Request, res: Response) => {
    const createdBlog = blogsRepository.createBlog(req.body);
    res.status(HTTPStatusCodesEnum.Created_201).send(createdBlog);
});
blogsRouter.get(SETTINGS.PATH.BLOGS, (req: Request, res: Response) => {
    const foundBlog = blogsRepository.findBlogById(req.params.id);
    if (foundBlog) return res.status(HTTPStatusCodesEnum.OK_200).send(foundBlog)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
blogsRouter.put(SETTINGS.PATH.BLOGS, authMiddleware, updateBlogValidation, (req: Request, res: Response) => {
    const isUpdated = blogsRepository.updateBlog(req.params.id, req.body);
    if (isUpdated) return res.status(HTTPStatusCodesEnum.No_Content_204)
    return response.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
blogsRouter.delete(SETTINGS.PATH.BLOGS, (req: Request, res: Response) => {
    const isDeleted = blogsRepository.deleteBlogById(req.params.id);
    if (isDeleted) return res.status(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
});