import express, {Request, Response} from 'express'
import cors from 'cors'
import {testingRouter} from "./testing/testing.router";
import {blogsRouter} from "./blogs/blogs.router";
import {postsRouter} from "./posts/posts.router";
import {authRouter} from "./auth/auth.router";
import {userRouter} from "./users/users.router";
import {routerPaths} from "./common/path/path";
import {HttpStatusCodes} from "./common/types/httpsStatusCodes";

export const app = express();

// Middlewares
app.use(express.json()); // body и query в реквестах

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatusCodes.No_Content_204).send("5th hometask already!")
})
app.use(routerPaths.testing,testingRouter);
app.use(routerPaths.auth.login, authRouter);
app.use(routerPaths.blogs, blogsRouter);
app.use(routerPaths.posts, postsRouter);
app.use(routerPaths.users, userRouter);