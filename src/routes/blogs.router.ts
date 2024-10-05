import {Response, Router} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {authMiddleware} from "../middlewares/authorization.middleware";
import {
    createBlogValidation,
    createPostForSpecificBlogValidation,
    updateBlogValidation
} from "../middlewares/validation/blogs/blogs.validation.middleware";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {DeleteParamsBlogModel} from "../models/blogs/DeleteParamsBlogModel";
import {UpdateParamsBlogModel} from "../models/blogs/UpdateParamsBlogModel";
import {BlogInputModel} from "../models/blogs/BlogInputModel";
import {QueryParamsBlogModel} from "../models/blogs/QueryParamsBlogModel";
import {PaginatorBlogViewModel} from "../models/blogs/PaginatorBlogViewModel";
import {blogsService} from "../service/blogs.service";
import {CreateBlogPostInputModel} from "../models/blogs/CreateBlogPostInputModel";
import {BlogPostInputModel} from "../models/blogs/BlogPostInputModel";
import {SearchQueryBlogModel} from "../models/blogs/SearchQueryBlogModel";
import {blogsQueryRepository} from "../repositories/Mongo/blogs.db.repository";
import {QueryParamsPostModel} from "../models/posts/QueryParamsPostModel";
import {PostViewModel} from "../models/posts/PostViewModel";

export const blogsRouter: Router = Router()

blogsRouter.get('/', async (req: RequestWithQuery<SearchQueryBlogModel>, res: Response) => {
    const blogs: PaginatorBlogViewModel = await blogsQueryRepository.findBlogsPagination(
        req.query.searchNameTerm,
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize
    )
    res.status(HTTPStatusCodesEnum.OK_200).send(blogs)
})
blogsRouter.post('/', authMiddleware, createBlogValidation, async (req: RequestWithBody<BlogInputModel>, res: Response) => {
    const createdBlog: BlogViewModel = await blogsService.createBlog(req.body);
    res.status(HTTPStatusCodesEnum.Created_201).send(createdBlog);
})
blogsRouter.get('/:id/posts', async (req: RequestWithParamsAndQuery<QueryParamsPostModel, SearchQueryBlogModel>, res: Response) => {
    const allPostsOfBlog = await blogsQueryRepository.getAllPostsOfBlog(
        req.params.id,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    if (allPostsOfBlog) return res.status(HTTPStatusCodesEnum.OK_200).send(allPostsOfBlog)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
blogsRouter.post('/:id/posts', authMiddleware, createPostForSpecificBlogValidation, async (req: RequestWithParamsAndBody<CreateBlogPostInputModel, BlogPostInputModel>, res: Response) => {
    const createdPostOfBlog: PostViewModel | null = await blogsService.createPostForBlog(req.params.id, req.body);
    if (createdPostOfBlog) return res.status(HTTPStatusCodesEnum.Created_201).send(createdPostOfBlog)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
blogsRouter.get('/:id', async (req: RequestWithParams<QueryParamsBlogModel>, res: Response) => {
    const foundBlog: BlogViewModel | null = await blogsService.findBlogById(req.params.id);
    if (foundBlog) return res.status(HTTPStatusCodesEnum.OK_200).send(foundBlog)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
blogsRouter.put('/:id', authMiddleware, updateBlogValidation, async (req: RequestWithParamsAndBody<UpdateParamsBlogModel, BlogInputModel>, res: Response) => {
    const isUpdated: boolean = await blogsService.updateBlog(req.params.id, req.body);
    if (isUpdated) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
blogsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<DeleteParamsBlogModel>, res: Response) => {
    const isDeleted: boolean = await blogsService.deleteBlogById(req.params.id);
    if (isDeleted) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})