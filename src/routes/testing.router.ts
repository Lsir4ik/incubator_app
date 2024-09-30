import {Request, Response, Router} from "express";
import {HTTPStatusCodesEnum} from "../settings";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";
import {postsRepository} from "../repositories/Mongo/posts.db.repository";
import {usersRepository} from "../repositories/Mongo/users.db.repository";
import {usersService} from "../service/users.service";
import {postsService} from "../service/posts.service";
import {blogsService} from "../service/blogs.service";

export const testingRouter = Router()

testingRouter.delete('/', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await usersService.deleteAllUsers()
    res.sendStatus(HTTPStatusCodesEnum.No_Content_204);
})