import {Request, Response, Router} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";
import {authMiddleware} from "../middlewares/authorization.middleware";
import {createBlogValidation, updateBlogValidation} from "../middlewares/validation/blogs/blogs.validation.middleware";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {DeleteParamsBlogModel} from "../models/blogs/DeleteParamsBlogModel";
import {UpdateParamsBlogModel} from "../models/blogs/UpdateParamsBlogModel";
import {BlogInputModel} from "../models/blogs/BlogInputModel";
import {QueryParamsBlogModel} from "../models/blogs/QueryParamsBlogModel";

export const blogsRouter: Router = Router()

blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs: BlogViewModel[] = await blogsRepository.findAllBlogs()
    res.status(HTTPStatusCodesEnum.OK_200).send(blogs)
})
blogsRouter.post('/', authMiddleware, createBlogValidation, async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const createdBlog: BlogViewModel = await blogsRepository.createBlog(req.body);
    res.status(HTTPStatusCodesEnum.Created_201).send(createdBlog);
})
blogsRouter.get('/:id', async (req: RequestWithParams<QueryParamsBlogModel>, res: Response) => {
    const foundBlog: BlogViewModel |null = await blogsRepository.findBlogById(req.params.id);
    if (foundBlog) return res.status(HTTPStatusCodesEnum.OK_200).send(foundBlog)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
blogsRouter.put('/:id', authMiddleware, updateBlogValidation, async (req: RequestWithParamsAndBody<UpdateParamsBlogModel, BlogInputModel>, res: Response) => {
    const isUpdated: boolean = await blogsRepository.updateBlog(req.params.id, req.body);
    if (isUpdated) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<DeleteParamsBlogModel>, res: Response) => {
    const isDeleted: boolean = await blogsRepository.deleteBlogById(req.params.id);
    if (isDeleted) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})