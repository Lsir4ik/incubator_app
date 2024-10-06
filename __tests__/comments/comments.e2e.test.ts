import {app} from "../../src/app";
import {agent} from "supertest";
import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {blogsTestManager} from "../blogs/blogs.test.helpers";
import {PostInputModel} from "../../src/models/posts/PostInputModel";
import {postsTestManager} from "../posts/posts.test.helpers";
import {CommentInputModel} from "../../src/models/comments/CommentInputModel";
import {UserInputModel} from "../../src/models/users/UserInputModel";
import {usersTestManager} from "../users/users.test.helpers";
import {LoginInputModel} from "../../src/models/login/LoginInputModel";
import {BlogViewModel} from "../../src/models/blogs/BlogViewModel";
import {PostViewModel} from "../../src/models/posts/PostViewModel";
import {UserViewModel} from "../../src/models/users/UserViewModel";
import {LoginSuccessViewModel} from "../../src/models/login/LoginSuccessViewModel";
import {CommentViewModel} from "../../src/models/comments/CommentViewModel";
import exp = require("node:constants");

const req = agent(app)

describe('Comments', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })

    let createdBlog: BlogViewModel
    let createdPost: PostViewModel
    let createdUser: UserViewModel
    let token: LoginSuccessViewModel
    let createdComment: CommentViewModel

    it('+Create all entity flow -> blog, post, user, authJwtToken', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
        }
        const {status: createBlogStatus,body: createdBlogBody} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(createBlogStatus).toBe(HTTPStatusCodesEnum.Created_201)
        createdBlog = createdBlogBody

        const dataToCreatePost: PostInputModel = {
            title: '1st Post',
            shortDescription: '1st Post description',
            content: '1st Post content',
            blogId: createdBlogBody.id
        }
        const {status: createPostStatus,body: createdPostBody} = await postsTestManager.createPost(dataToCreatePost)
        expect(createPostStatus).toBe(HTTPStatusCodesEnum.Created_201)
        createdPost = createdPostBody

        const dataToCreateUser: UserInputModel = {
            login: 'admin',
            password: 'qwerty',
            email: 'admin@test.com',
        }
        const {status: createUserStatus, body: createdUserBody} = await usersTestManager.createUser(dataToCreateUser)
        expect(createUserStatus).toBe(HTTPStatusCodesEnum.Created_201)
        createdUser = createdUserBody

        const authData: LoginInputModel = {
            loginOrEmail: createdUserBody.login,
            password: 'qwerty',
        }
        const {status, body: tokenBody} = await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authData)
        expect(status).toEqual(HTTPStatusCodesEnum.OK_200)
        token = tokenBody

    })
    it('+POST =/posts/{postID}/comments= should create comment for existing post, status 201', async () => {
        // Create comment for post
        const dataToCreateComment: CommentInputModel = {
            content: 'some 1 content has 20 symbols at least',
        }
        const createdCommentRes = await req
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToCreateComment)
        expect(createdCommentRes.status).toEqual(HTTPStatusCodesEnum.Created_201)
        expect(createdCommentRes.body).toEqual({
            id: expect.any(String),
            content: dataToCreateComment.content,
            commentatorInfo:{userId: createdUser.id, userLogin:createdUser.login},
            createdAt: expect.any(String),
        })
        createdComment = createdCommentRes.body

    })
    it('+GET =/posts/{postID}/comments= should return all comment pagination, status 200', async () => {
        // Dataset
        const dataToCreateComment2: CommentInputModel = {
            content: 'some 2 content has 20 symbols at least',
        }
        const dataToCreateComment3: CommentInputModel = {
            content: 'some 3 content has 20 symbols at least',
        }
        const dataToCreateComment4: CommentInputModel = {
            content: 'some 4 content has 20 symbols at least',
        }
        // Create comments
        await req
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToCreateComment2)
        await req
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToCreateComment3)
        await req
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToCreateComment4)

        // Get pagination comments with default query
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
        expect(res.status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 4,
            items: [
                {
                    id: expect.any(String),
                    content: 'some 4 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    content: 'some 3 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    content: 'some 2 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    content: 'some 1 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
                    createdAt: expect.any(String),
                }
            ]
        })

        // Get pagination query
        // Get pagination comments
        const resPagin = await req
            .get(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .query({pageNumber: 2, pageSize: 2, sortDirection: 'asc'})
        expect(resPagin.status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(resPagin.body).toEqual({
            pagesCount: 2,
            page: 2,
            pageSize: 2,
            totalCount: 4,
            items: [
                {
                    id: expect.any(String),
                    content: 'some 3 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    content: 'some 4 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
                    createdAt: expect.any(String),
                }
            ]
        })


    })
    it('+PUT and +GET by id =/comments/{commentId}= should return error with incorrect input data, status 400', async () => {
        const dataToUpdateComment: CommentInputModel = {
            content: 'some 1 UPDATED content has 20 symbols at least'
        }
        const res = await req.put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToUpdateComment)
        expect(res.status).toEqual(HTTPStatusCodesEnum.No_Content_204)

        // Get by id
        const updatedComment = await req.get(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
        expect(updatedComment.status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(updatedComment.body).toEqual({
            id: expect.any(String),
            content: 'some 1 UPDATED content has 20 symbols at least',
            commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
            createdAt: expect.any(String),
        })
    })
    it('-DELETE, PUT =/comments/{commentId}= should return an error, if id not found, status 404', async () => {
        const resDelete = await req.delete(`${SETTINGS.PATH.COMMENTS}/123789164`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
        expect(resDelete.status).toEqual(HTTPStatusCodesEnum.Not_Found_404)

        const resUpdate = await req.put(`${SETTINGS.PATH.COMMENTS}/123789164`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send({
                content: 'some 1 UPDATED content has 20 symbols at least'
            })
        expect(resUpdate.status).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('-DELETE, PUT =/comments/{commentId}= should return an error with with incorrect auth credentials, status 401', async () => {
        const resDelete = await req.delete(`${SETTINGS.PATH.COMMENTS}/123789164`)
            .set({'Authorization': 'Bearer ' + 'token.accessToken'})
        expect(resDelete.status).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        const resUpdate = await req.put(`${SETTINGS.PATH.COMMENTS}/123789164`)
            .set({'Authorization': 'Bearer ' + 'token.accessToken'})
            .send({
                content: 'some 1 UPDATED content has 20 symbols at least'
            })
        expect(resUpdate.status).toEqual(HTTPStatusCodesEnum.Unauthorized_401)
    })
    it('-DELETE, PUT =/comments/{commentId}= should return an error with access denied, status 403', async () => {
        // Create user
        const dataToCreateUser: UserInputModel = {
            login: 'user2',
            password: 'qwerty',
            email: 'user2@test.com',
        }
        const {status: createUserStatus, body: createdUserBody} = await usersTestManager.createUser(dataToCreateUser)
        expect(createUserStatus).toBe(HTTPStatusCodesEnum.Created_201)

        // Auth get token
        const authData: LoginInputModel = {
            loginOrEmail: createdUserBody.login,
            password: 'qwerty',
        }
        const {status, body: tokenBody} = await req
            .post(`${SETTINGS.PATH.AUTH}/login`)
            .send(authData)
        expect(status).toEqual(HTTPStatusCodesEnum.OK_200)

        // DELETE with 403 error
        const resDelete = await req.delete(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + tokenBody.accessToken})
        expect(resDelete.status).toEqual(HTTPStatusCodesEnum.Forbidden_403)

        // Update with 403 error
        const resUpdate = await req.put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + tokenBody.accessToken})
            .send({
                content: 'some 1 UPDATED content has 20 symbols at least'
            })
        expect(resUpdate.status).toEqual(HTTPStatusCodesEnum.Forbidden_403)
    })
    it('+DELETE =/comments/{commentId}= should delete existing comment by id, status 204', async () => {
        const res =  await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
        expect(res.status).toEqual(HTTPStatusCodesEnum.No_Content_204)

        // -----Удаляем коммент createdComment----
    })
    it('-POST =/posts/{postID}/comments= should return error with incorrect input data, status 400', async () => {
        const dataToCreateComment: CommentInputModel = {
            content: 'less than 20',
        }
        const createdCommentRes = await req
            .post(`${SETTINGS.PATH.POSTS}/${createdPost.id}/comments`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToCreateComment)
        expect(createdCommentRes.status).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

    })
    it('-PUT =/comments/{commentId}= should return error with incorrect input data, status 400', async () => {
        const dataToUpdateComment: CommentInputModel = {
            content: 'less than 20'
        }
        const res = await req.put(`${SETTINGS.PATH.COMMENTS}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .send(dataToUpdateComment)
        expect(res.status).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
    })
})