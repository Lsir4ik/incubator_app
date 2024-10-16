import request from "supertest";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import {usersTestManager} from "./utils/users.test.helpers";
import {LoginInputModel} from "../src/auth/types/LoginInputModel";
import {app} from "../src/app";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {commentTestManager} from "./utils/comments.test.helpers";
import {testDtosCreator} from "./utils/testDtosCreator";
import {ObjectId} from "mongodb";


describe('Comments', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    beforeEach(async () => {
        await db.drop()
    })
    afterAll(async () => {
        await db.stop()
    })
    afterAll(done => {
        done()
    })

    it('+POST =/posts/{postID}/comments= should create comment for existing post, status 201', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const commentDto = testDtosCreator.createCommentDto({})

        const createdCommentRes = await request(app)
            .post(`${routerPaths.posts}/${createdPost.id}/comments`)
            .auth(token.accessToken, {type: 'bearer'})
            .send(commentDto)
            .expect(HttpStatusCodes.Created_201)
        expect(createdCommentRes.body).toEqual({
            id: expect.any(String),
            content: commentDto.content,
            commentatorInfo:{userId: createdUser.id, userLogin:createdUser.login},
            createdAt: expect.any(String),
        })
    })
    it('+GET =/posts/{postID}/comments= should return all comment pagination, status 200', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        await commentTestManager.createComments(createdPost.id, 20, token)

        // Get pagination comments with default query
        const res = await request(app)
            .get(`${routerPaths.posts}/${createdPost.id}/comments`)
            .query({pageNumber: 2, pageSize: 2, sortDirection: 'asc'})
            .expect(HttpStatusCodes.OK_200)
        expect(res.body).toEqual({
            pagesCount: 10,
            page: 2,
            pageSize: 2,
            totalCount: 20,
            items: [
                {
                    id: expect.any(String),
                    content: 'some test 3 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin: createdUser.login},
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    content: 'some test 4 content has 20 symbols at least',
                    commentatorInfo: {userId: createdUser.id, userLogin: createdUser.login},
                    createdAt: expect.any(String),
                }
            ]
        })
    })
    it('+PUT and +GET by id =/comments/{commentId}= should return error with incorrect input data, status 400', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const createdComment = await commentTestManager.createComment(createdPost.id,token.accessToken)

        const commentDto = testDtosCreator.createCommentDto({content: 'some test_UPD content has 20 symbols at least'})

        const res = await request(app)
            .put(`${routerPaths.comments}/${createdComment.id}`)
            .auth(token.accessToken, {type: 'bearer'})
            .send(commentDto)
            .expect(HttpStatusCodes.No_Content_204)

        // Get by id
        const updatedComment = await request(app)
            .get(`${routerPaths.comments}/${createdComment.id}`)
            .expect(HttpStatusCodes.OK_200)
        expect(updatedComment.body).toEqual({
            id: expect.any(String),
            content: commentDto.content,
            commentatorInfo: {userId: createdUser.id, userLogin:createdUser.login},
            createdAt: expect.any(String),
        })
    })
    it('-DELETE, PUT =/comments/{commentId}= should return an error, if id not found, status 404', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const createdComment = await commentTestManager.createComment(createdPost.id,token.accessToken)
        const commentDto = testDtosCreator.createCommentDto({content: 'some test_UPD content has 20 symbols at least'})
        const randomObjectId = new ObjectId().toString()
        await request(app).delete(`${routerPaths.comments}/${randomObjectId}`)
            .auth(token.accessToken, {type: 'bearer'})
            .expect(HttpStatusCodes.Not_Found_404)

        await request(app).put(`${routerPaths.comments}/${randomObjectId}`)
            .auth(token.accessToken, {type: 'bearer'})
            .send(commentDto)
            .expect(HttpStatusCodes.Not_Found_404)
    })
    it('-DELETE, PUT =/comments/{commentId}= should return an error with with incorrect auth credentials, status 401', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const createdComment = await commentTestManager.createComment(createdPost.id,token.accessToken)
        const commentDto = testDtosCreator.createCommentDto({content: 'some test_UPD content has 20 symbols at least'})

        await request(app).delete(`${routerPaths.comments}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + 'token.accessToken'})
            .expect(HttpStatusCodes.Unauthorized_401)

        await request(app).put(`${routerPaths.comments}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + 'token.accessToken'})
            .send(commentDto.content)
            .expect(HttpStatusCodes.Unauthorized_401)
    })
    it('-DELETE, PUT =/comments/{commentId}= should return an error with access denied, status 403', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const createdComment = await commentTestManager.createComment(createdPost.id,token.accessToken)
        const commentDto = testDtosCreator.createCommentDto({content: 'some test_UPD content has 20 symbols at least'})
        const arrCreatedUsers = await usersTestManager.createUsers(2) // TODO может быть ошибка


        // Auth get token
        const authData: LoginInputModel = {
            loginOrEmail: arrCreatedUsers[1].login,
            password: 'qwerty',
        }
        const {body: token2} = await request(app)
            .post(routerPaths.auth.login)
            .send(authData)
            .expect(HttpStatusCodes.OK_200)

        // DELETE with 403 error
        await request(app).delete(`${routerPaths.comments}/${createdComment.id}`)
            .auth(token2.accessToken, {type: 'bearer'})
            .expect(HttpStatusCodes.Forbidden_403)

        // Update with 403 error
        await request(app).put(`${routerPaths.comments}/${createdComment.id}`)
            .auth(token2.accessToken, {type: 'bearer'})
            .send(commentDto)
            .expect(HttpStatusCodes.Forbidden_403)
    })
    it('+DELETE =/comments/{commentId}= should delete existing comment by id, status 204', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const createdComment = await commentTestManager.createComment(createdPost.id,token.accessToken)

        await request(app)
            .delete(`${routerPaths.comments}/${createdComment.id}`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
            .expect(HttpStatusCodes.No_Content_204)
    })
    it('-POST =/posts/{postID}/comments= should return error with incorrect input data, status 400', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const commentDto = testDtosCreator.createCommentDto({content: 'less than 20'})
        await request(app)
            .post(`${routerPaths.posts}/${createdPost.id}/comments`)
            .auth(token.accessToken, {type: 'bearer'})
            .send(commentDto.content)
            .expect(HttpStatusCodes.Bad_Request_400)
    })
    it('-PUT =/comments/{commentId}= should return error with incorrect input data, status 400', async () => {
        const {createdBlog, createdPost, createdUser, token} = await commentTestManager.createAllEntityFlow()
        const commentDto = testDtosCreator.createCommentDto({content: 'less than 20'})
        const createdComment = await commentTestManager.createComment(createdPost.id,token.accessToken)

        await request(app).put(`${routerPaths.comments}/${createdComment.id}`)
            .auth(token.accessToken, {type: 'bearer'})
            .send(commentDto)
            .expect(HttpStatusCodes.Bad_Request_400)
    })
})