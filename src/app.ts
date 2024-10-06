import express, {Request, Response} from 'express'
import {HTTPStatusCodesEnum, SETTINGS} from "./settings";
import {testingRouter} from "./routes/testing.router";
import {blogsRouter} from "./routes/blogs.router";
import {postsRouter} from "./routes/posts.router";
import {authRouter} from "./routes/auth.router";
import {userRouter} from "./routes/users.router";
import {commentsRouter} from "./routes/comments.router";

export const app = express();

app.use(express.json()); // создание свойств-объектов body и query во всех реквестах

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(HTTPStatusCodesEnum.No_Content_204).send("6th hometask already!")
})
app.use(SETTINGS.PATH.TESTING,testingRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);
app.use(SETTINGS.PATH.AUTH, authRouter);
app.use(SETTINGS.PATH.USERS, userRouter);
app.use(SETTINGS.PATH.COMMENTS, commentsRouter);