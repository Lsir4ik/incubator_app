import express, {Request, Response} from 'express'
import cors from 'cors'
import {HTTPStatusCodesEnum, SETTINGS} from "./settings";
import {testingRouter} from "./routes/testing.router";
import {blogsRouter} from "./routes/blogs.router";
import {postsRouter} from "./routes/posts.router";

export const app = express();

// Middlewares
app.use(cors()); // разрешить любым фронтам делать запросы на бэк
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(HTTPStatusCodesEnum.No_Content_204).send("HW1")
})
app.use(SETTINGS.PATH.TESTING,testingRouter);
app.use(SETTINGS.PATH.BLOGS, blogsRouter);
app.use(SETTINGS.PATH.POSTS, postsRouter);