import {Response, Router} from "express";
import {PostViewModel} from "./types/PostViewModel";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {createPostValidation, updatePostValidation} from "./middlewares/posts.validation.middleware";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../common/types/requests";
import {PostInputModel} from "./types/PostInputModel";
import {postsService} from "./posts.service";
import {PaginatorPostViewModel} from "./types/PaginatorPostViewModel";
import {SearchQueryPostsModel} from "./types/SearchQueryPostsModel";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {postsQueryRepository} from "./posts.query.repository";
import {IdType} from "../common/types/id";
import {authBearerGuard} from "../auth/guards/access.token.guard";
import {createCommentValidation} from "../comments/middlewares/comments.validation.middleware";
import {CommentInputModel} from "../comments/types/CommentInputModel";
import {PaginatorCommentViewModel} from "../comments/types/PaginatorCommentViewModel";
import {commentsQueryRepository} from "../comments/comments.query.repository";
import {CommentViewModel} from "../comments/types/CommentViewModel";
import {commentsService} from "../comments/comments.service";

export const postsRouter: Router = Router()


postsRouter.get('/:id/comments', async (req: RequestWithParamsAndQuery<IdType, SearchQueryPostsModel>, res: Response<PaginatorCommentViewModel>) => {
    const foundPost = await postsService.isPostExist(req.params.id)
    if (!foundPost) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    const foundComments = await commentsQueryRepository.findCommentsOfPost(
        req.params.id,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    return res.status(HttpStatusCodes.OK_200).send(foundComments)
})
postsRouter.post('/:id/comments', authBearerGuard, createCommentValidation, async (req: RequestWithParamsAndBody<IdType, CommentInputModel>, res: Response<CommentViewModel>) => {
    const foundPost = await postsService.isPostExist(req.params.id)
    if (!foundPost) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    const createdCommentId = await commentsService.createCommentForPost(req.params.id, req.body, req.user!.id)
    if (!createdCommentId) return res.sendStatus(HttpStatusCodes.Forbidden_403)
    const createdComment = await commentsQueryRepository.findCommentById(createdCommentId)
    return res.status(HttpStatusCodes.Created_201).send(createdComment!)
})
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
