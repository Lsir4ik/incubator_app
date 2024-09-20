import {Request, Response, Router} from "express";
import {HTTPStatusCodesEnum, SETTINGS} from "../settings";
import {blogsRepository} from "../repositories/Local/blogs.memory.repository";
import {postRepository} from "../repositories/Local/posts.memory.repository";

export const testingRouter = Router()

testingRouter.delete(SETTINGS.PATH.TESTING, (req: Request, res: Response) => {
    blogsRepository.deleteAllBlogs()
    postRepository.deleteAllPosts()
    res.sendStatus(HTTPStatusCodesEnum.No_Content_204);
})