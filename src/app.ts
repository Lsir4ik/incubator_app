import express, {Request, Response} from 'express'
import {testingRouter} from "./testing/testing.router";
import {blogsRouter} from "./blogs/blogs.router";
import {postsRouter} from "./posts/posts.router";
import {authRouter} from "./auth/auth.router";
import {userRouter} from "./users/users.router";
import {routerPaths} from "./common/path/path";
import {HttpStatusCodes} from "./common/types/httpsStatusCodes";
import {commentsRouter} from "./comments/comments.router";
import cookieParser from "cookie-parser";


export const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatusCodes.No_Content_204).send("8th hometask already!")
});
app.use(routerPaths.testing, testingRouter);
app.use(routerPaths.common, authRouter);
app.use(routerPaths.blogs, blogsRouter);
app.use(routerPaths.posts, postsRouter);
app.use(routerPaths.users, userRouter);
app.use(routerPaths.comments, commentsRouter);