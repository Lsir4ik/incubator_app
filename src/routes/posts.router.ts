import {Response, Router} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {PostViewModel} from "../models/posts/PostViewModel";
import {authBarerMiddleware, authMiddleware} from "../middlewares/authorization.middleware";
import {createPostValidation, updatePostValidation} from "../middlewares/validation/posts/posts.validation.middleware";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/types";
import {PostInputModel} from "../models/posts/PostInputModel";
import {UpdateParamsPostModel} from "../models/posts/UpdateParamsPostModel";
import {QueryParamsPostModel} from "../models/posts/QueryParamsPostModel";
import {DeleteParamsBlogModel} from "../models/blogs/DeleteParamsBlogModel";
import {postsService} from "../service/posts.service";
import {postsQueryRepository} from "../repositories/Mongo/posts.db.repository";
import {PaginatorPostModel} from "../models/posts/PaginatorPostModel";
import {SearchQueryPostsModel} from "../models/posts/SearchQueryPostsModel";
import {createCommentValidation} from "../middlewares/validation/comments/comments.validation.middleware";
import {CommentInputModel} from "../models/comments/CommentInputModel";

export const postsRouter: Router = Router()

postsRouter.get('/:id/comments', async (req: RequestWithParamsAndQuery<QueryParamsPostModel, SearchQueryPostsModel>, res: Response) => {
    const foundPost = await postsService.findPostById(req.params.id)
    if (!foundPost) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    const foundComments = await postsQueryRepository.findCommentsOfPost(
        req.params.id,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    return res.status(HTTPStatusCodesEnum.OK_200).send(foundComments)
})
postsRouter.post('/:id/comments', authBarerMiddleware, createCommentValidation, async (req: RequestWithParamsAndBody<QueryParamsPostModel, CommentInputModel>, res: Response) => {
    const foundPost = await postsService.findPostById(req.params.id)
    if (!foundPost) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    const createdComment = await postsService.createCommentForPost(req.params.id, req.body, req.user!.id)
    return res.status(HTTPStatusCodesEnum.Created_201).send(createdComment)
})
postsRouter.get('/', async (req: RequestWithQuery<SearchQueryPostsModel>, res: Response) => {
    const foundPosts: PaginatorPostModel = await postsQueryRepository.findPostsPagination(
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
    )
    res.status(HTTPStatusCodesEnum.OK_200).send(foundPosts)
})
postsRouter.post('/', authMiddleware, createPostValidation, async (req: RequestWithBody<PostInputModel>, res: Response) => {
    const createdPost: PostViewModel | null = await postsService.createPost(req.body);
    if (createdPost) return res.status(HTTPStatusCodesEnum.Created_201).send(createdPost);
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.get('/:id', async (req: RequestWithParams<QueryParamsPostModel>, res: Response) => {
    const foundPost: PostViewModel | null = await postsService.findPostById(req.params.id);
    if (foundPost) return res.status(HTTPStatusCodesEnum.OK_200).send(foundPost);
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.put('/:id', authMiddleware, updatePostValidation, async (req: RequestWithParamsAndBody<UpdateParamsPostModel, PostInputModel>, res: Response) => {
    const isUpdated: boolean = await postsService.updatePost(req.params.id, req.body);
    if (isUpdated) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<DeleteParamsBlogModel>, res: Response) => {
    const isDeleted: boolean = await postsService.deletePostById(req.params.id);
    if (isDeleted) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
