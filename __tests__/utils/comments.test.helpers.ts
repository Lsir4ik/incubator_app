import {blogsTestManager} from "./blogs.test.helpers";
import {postsTestManager} from "./posts.test.helpers";
import {usersTestManager} from "./users.test.helpers";
import {LoginInputModel} from "../../src/auth/types/LoginInputModel";
import request from "supertest";
import {app} from "../../src/app";
import {routerPaths} from "../../src/common/path/path";
import {HttpStatusCodes} from "../../src/common/types/httpsStatusCodes";
import {testDtosCreator} from "./testDtosCreator";
import {CommentInputModel} from "../../src/comments/types/CommentInputModel";
import {LoginSuccessViewModel} from "../../src/auth/types/LoginSuccessViewModel";

export const commentTestManager = {
    async createAllEntityFlow() {
        /**
         *
         */
        const createdBlog = await blogsTestManager.createBlog()
        const createdPost = await postsTestManager.createPost(createdBlog.id)
        const createdUser = await usersTestManager.createUser()

        const authData: LoginInputModel = {
            loginOrEmail: createdUser.login,
            password: 'qwerty',
        }
        const {body: token} = await request(app)
            .post(routerPaths.auth.login)
            .send(authData)
            .expect(HttpStatusCodes.OK_200)

        return {createdBlog, createdPost, createdUser, token}
    },
    async createComment(postId: string, token: string, commentDto?: CommentInputModel) {
        // return request(app).post(routerPaths.posts).set({'Authorization': 'Basic ' + codeAuth}).send(data)
        const dto = commentDto ?? testDtosCreator.createCommentDto({})
        const res = await request(app).post(`${routerPaths.posts}/${postId}/comments`).auth(token, {type: 'bearer'}).send({
            content: dto.content,
        })
            .expect(HttpStatusCodes.Created_201)
        return res.body
    },
    async createComments(postId: string, count: number, token: LoginSuccessViewModel) {
        const comments = []
        for (let i = 1; i <= count; i++) {
            const res = await request(app)
                .post(`${routerPaths.posts}/${postId}/comments`)
                .auth(token.accessToken, {type: 'bearer'})
                .send({
                    content: `some test ${i} content has 20 symbols at least`
                })
                .expect(HttpStatusCodes.Created_201)
            comments.push(res.body)
        }
        return comments
    },
}