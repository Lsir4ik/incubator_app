import express, {Router, Request, Response} from "express";
import {HTTPStatusCodesEnum, SETTINGS} from "../settings";
import {postRepository} from "../repositories/Local/posts.memory.repository";
import {PostViewModel} from "../models/posts/PostViewModel";
import {authMiddleware} from "../middlewares/authorization.middleware";
import {createBlogValidation} from "../middlewares/validation/blogs/blogs.validation.middleware";
import {createPostValidation, updatePostValidation} from "../middlewares/validation/posts/posts.validation.middleware";

export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts = postRepository.findAllPosts()
    res.status(HTTPStatusCodesEnum.OK_200).send(foundPosts)
})
postsRouter.post(SETTINGS.PATH.BLOGS, authMiddleware, createPostValidation, (req: Request, res: Response) => {
    const createdPost: PostViewModel | null = postRepository.createPost(req.body);
    if(createdPost) return res.status(HTTPStatusCodesEnum.Created_201).send(createdPost);
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.get(SETTINGS.PATH.BLOGS, (req: Request, res: Response) => {
    const foundPost: PostViewModel | undefined = postRepository.findPostById(req.params.id);
    if(foundPost) return res.status(HTTPStatusCodesEnum.OK_200).send(foundPost);
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.put(SETTINGS.PATH.BLOGS, authMiddleware, updatePostValidation, (req: Request, res: Response) => {
    const isUpdated: boolean = postRepository.updatePost(req.params.id, req.body);
    if (isUpdated) return res.status(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404);
})
postsRouter.delete(SETTINGS.PATH.POSTS, authMiddleware, (req: Request, res: Response) => {
    const isDeleted: boolean = postRepository.deletePostById(req.params.id);
    if (isDeleted) return res.status(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
