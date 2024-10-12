import {Response, Router} from "express";
import {PostViewModel} from "./types/PostViewModel";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {createPostValidation, updatePostValidation} from "./middlewares/posts.validation.middleware";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../common/types/requests";
import {PostInputModel} from "./types/PostInputModel";
import {postsService} from "./posts.service";
import {PaginatorPostViewModel} from "./types/PaginatorPostViewModel";
import {SearchQueryPostsModel} from "./types/SearchQueryPostsModel";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {postsQueryRepository} from "./posts.query.repository";
import {IdType} from "../common/types/id";

export const postsRouter: Router = Router()

postsRouter.get('/', async (req: RequestWithQuery<SearchQueryPostsModel>, res: Response<PaginatorPostViewModel>) => {
    const foundPosts: PaginatorPostViewModel = await postsQueryRepository.findPostsPagination(
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    res.status(HttpStatusCodes.OK_200).send(foundPosts)
})
postsRouter.post('/', baseAuthGuard, createPostValidation, async (req: RequestWithBody<PostInputModel>, res: Response<PostViewModel>) => {
    const createdPostId = await postsService.createPost(req.body)
    if(!createdPostId)  return res.sendStatus(HttpStatusCodes.Not_Found_404)
    const foundPost = await postsQueryRepository.findPostById(createdPostId)
    if (!foundPost) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.status(HttpStatusCodes.Created_201).send(foundPost)
})
postsRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<PostViewModel>) => {
    const foundPost= await postsQueryRepository.findPostById(req.params.id)
    if(!foundPost) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.status(HttpStatusCodes.OK_200).send(foundPost)
})
postsRouter.put('/:id', baseAuthGuard, updatePostValidation, async (req: RequestWithParamsAndBody<IdType, PostInputModel>, res: Response) => {
    const isUpdated = await postsService.updatePost(req.params.id, req.body)
    if (!isUpdated) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
postsRouter.delete('/:id', baseAuthGuard, async (req: RequestWithParams<IdType>, res: Response) => {
    const isDeleted = await postsService.deletePostById(req.params.id)
    if (!isDeleted) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
