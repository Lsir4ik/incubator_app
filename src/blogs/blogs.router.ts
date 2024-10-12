import {Response, Router} from "express";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {
    createBlogValidation,
    createPostForSpecificBlogValidation,
    updateBlogValidation
} from "./middlewares/blogs.validation.middleware";
import {BlogViewModel} from "./types/BlogViewModel";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../common/types/requests";
import {BlogInputModel} from "./types/BlogInputModel";
import {PaginatorBlogViewModel} from "./types/PaginatorBlogViewModel";
import {blogsService} from "./blogs.service";
import {BlogPostInputModel} from "./types/BlogPostInputModel";
import {QueryBlogModel} from "./types/QueryBlogModel";
import {PostViewModel} from "../posts/types/PostViewModel";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {blogsQueryRepository} from "./blogs.query.repository";
import {IdType} from "../common/types/id";
import {PaginatorPostViewModel} from "../posts/types/PaginatorPostViewModel";
import {postsQueryRepository} from "../posts/posts.query.repository";

export const blogsRouter: Router = Router()

blogsRouter.get('/', async (req: RequestWithQuery<QueryBlogModel>, res: Response<PaginatorBlogViewModel>) => {
    const blogs: PaginatorBlogViewModel = await blogsQueryRepository.findBlogsPagination(
        req.query.searchNameTerm,
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize
    )
    res.status(HttpStatusCodes.OK_200).send(blogs)
})
blogsRouter.post('/', baseAuthGuard, createBlogValidation, async (req: RequestWithBody<BlogInputModel>, res: Response<BlogViewModel>) => {
    const createdBlogId = await blogsService.createBlog(req.body)
    const foundBlog = await blogsQueryRepository.findBlogById(createdBlogId)
    if (foundBlog) return res.status(HttpStatusCodes.Created_201).send(foundBlog)
    return res.sendStatus(HttpStatusCodes.Bad_Request_400)
})
blogsRouter.get('/:id/posts', async (req: RequestWithParamsAndQuery<IdType, QueryBlogModel>, res: Response<PaginatorPostViewModel>) => {
    const allPostsOfBlog = await blogsQueryRepository.getAllPostsOfBlog(
        req.params.id,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    if (allPostsOfBlog) return res.status(HttpStatusCodes.OK_200).send(allPostsOfBlog)
    return res.sendStatus(HttpStatusCodes.Not_Found_404)
})
blogsRouter.post('/:id/posts', baseAuthGuard, createPostForSpecificBlogValidation, async (req: RequestWithParamsAndBody<IdType, BlogPostInputModel>, res: Response<PostViewModel>) => {
    const createdPostIdOfBlog = await blogsService.createPostForBlog(req.params.id, req.body)
    if (!createdPostIdOfBlog) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    const foundPost = await postsQueryRepository.findPostById(createdPostIdOfBlog)
    if (!foundPost) return res.status(HttpStatusCodes.Not_Found_404)
    return res.status(HttpStatusCodes.Created_201).send(foundPost)

})
blogsRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<BlogViewModel>) => {
    const foundBlog = await blogsQueryRepository.findBlogById(req.params.id);
    if (!foundBlog) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.status(HttpStatusCodes.OK_200).send(foundBlog)

})
blogsRouter.put('/:id', baseAuthGuard, updateBlogValidation, async (req: RequestWithParamsAndBody<IdType, BlogInputModel>, res: Response) => {
    const isUpdated: boolean = await blogsService.updateBlog(req.params.id, req.body);
    if (!isUpdated) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
blogsRouter.delete('/:id', baseAuthGuard, async (req: RequestWithParams<IdType>, res: Response) => {
    const isDeleted: boolean = await blogsService.deleteBlogById(req.params.id);
    if (!isDeleted) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})