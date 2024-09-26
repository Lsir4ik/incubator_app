import {Request, Response, Router} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";
import {postsRepository} from "../repositories/Mongo/posts.db.repository";

export const testingRouter = Router()

testingRouter.delete('/', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()
    res.sendStatus(HTTPStatusCodesEnum.No_Content_204);
})