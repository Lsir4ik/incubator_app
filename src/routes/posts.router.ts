import {Request, Response, Router} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {postRepository} from "../repositories/Mongo/posts.db.repository";
import {PostViewModel} from "../models/posts/PostViewModel";
import {authMiddleware} from "../middlewares/authorization.middleware";
import {createPostValidation, updatePostValidation} from "../middlewares/validation/posts/posts.validation.middleware";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {PostInputModel} from "../models/posts/PostInputModel";
import {UpdateParamsPostModel} from "../models/posts/UpdateParamsPostModel";
import {QueryParamsPostModel} from "../models/posts/QueryParamsPostModel";
import {DeleteParamsBlogModel} from "../models/blogs/DeleteParamsBlogModel";

export const postsRouter: Router = Router()

postsRouter.get('/', async (req: Request, res: Response) => {
    const foundPosts: PostViewModel[] = await postRepository.findAllPosts()
    res.status(HTTPStatusCodesEnum.OK_200).send(foundPosts)
})
postsRouter.post('/', authMiddleware, createPostValidation, async (req: RequestWithBody<PostInputModel>, res: Response) => {
    const createdPost: PostViewModel | null = await postRepository.createPost(req.body);
    if(createdPost) return res.status(HTTPStatusCodesEnum.Created_201).send(createdPost);
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.get('/:id', async (req: RequestWithParams<QueryParamsPostModel>, res: Response) => {
    const foundPost: PostViewModel | null = await postRepository.findPostById(req.params.id);
    if(foundPost) return res.status(HTTPStatusCodesEnum.OK_200).send(foundPost);
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.put('/:id', authMiddleware, updatePostValidation, async (req: RequestWithParamsAndBody<UpdateParamsPostModel, PostInputModel>, res: Response) => {
    const isUpdated: boolean = await postRepository.updatePost(req.params.id, req.body);
    if (isUpdated) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<DeleteParamsBlogModel>, res: Response) => {
    const isDeleted: boolean = await postRepository.deletePostById(req.params.id);
    if (isDeleted) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
