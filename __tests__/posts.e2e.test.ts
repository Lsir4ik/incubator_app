import request from "supertest";
import {app} from "../src/app";
import {PostInputModel} from "../src/posts/types/PostInputModel";
import {blogsTestManager} from "./utils/blogs.test.helpers";
import {postsTestManager} from "./utils/posts.test.helpers";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import {testDtosCreator} from "./utils/testDtosCreator";
import {ADMIN_LOGIN, ADMIN_PASS} from "../src/auth/guards/base.auth.guard";
import {ObjectId} from "mongodb";


describe('Posts', () => {
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

    it('POST, should create a post, status 201', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const postDto = testDtosCreator.createPostDto({blogId: createdBlog.id})

        // POST posts
        const res = await request(app)
            .post(routerPaths.posts)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(postDto)
            .expect(HttpStatusCodes.Created_201)

        expect(res.body).toEqual({
            id: res.body.id,
            title: 'testPost',
            shortDescription: 'testPostShortDescription',
            content: 'testPostContent',
            blogId: res.body.blogId,
            blogName: res.body.blogName,
            createdAt: res.body.createdAt
        })
        const {body: post} = await request(app).get(`${routerPaths.posts}/${res.body.id}`).expect(HttpStatusCodes.OK_200)
        expect(post).toEqual({
            id: res.body.id,
            title: 'testPost',
            shortDescription: 'testPostShortDescription',
            content: 'testPostContent',
            blogId: res.body.blogId,
            blogName: res.body.blogName,
            createdAt: res.body.createdAt
        })
    })
    it('PUT, should update existing blog, status 204', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const postDto = testDtosCreator.createPostDto({
            title: 'testPost_upd',
            shortDescription: 'testPostShortDescription_upd',
            content: 'testPostContent_upd',
            blogId: createdBlog.id
        })
        const createdPost = await postsTestManager.createPost(createdBlog.id)

        // PUT
        const res = await postsTestManager.updatePost(createdPost.id, postDto)
        expect(res.status).toEqual(HttpStatusCodes.No_Content_204)
    })
    it('DELETE, should delete existing post by id, status 204', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const postDto = testDtosCreator.createPostDto({blogId: createdBlog.id})
        const createdPost = await postsTestManager.createPost(createdBlog.id)

        const {status: deleteStatus} = await postsTestManager.deletePostById(createdPost.id)
        expect(deleteStatus).toEqual(HttpStatusCodes.No_Content_204)

        // GET
        const {status: getStatus} = await postsTestManager.getPostById(createdPost.id)
        expect(getStatus).toEqual(HttpStatusCodes.Not_Found_404)
    })
    it('GET, should return created post, status 200', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const createdPost = await postsTestManager.createPost(createdBlog.id)

        // GET
        const {status: getStatus} = await postsTestManager.getPostById(createdPost.id)
        expect(getStatus).toEqual(HttpStatusCodes.OK_200)
    })
    it('POST, PUT, DELETE should not create/update/delete a post with auth error, status 401', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const postDto = testDtosCreator.createPostDto({blogId: createdBlog.id})
        const createdPost = await postsTestManager.createPost(createdBlog.id)
        // POST
        await request(app)
            .post(routerPaths.posts)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(postDto)
            .expect(HttpStatusCodes.Unauthorized_401)

        // PUT
        await request(app)
            .put(`${routerPaths.posts}/${createdPost.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(postDto)
            .expect(HttpStatusCodes.Unauthorized_401)

        // DELETE by id
        await request(app)
            .delete(`${routerPaths.posts}/${createdPost.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .expect(HttpStatusCodes.Unauthorized_401)
    })
    it('POST, PUT, should not create a post with validation error, status 400', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const createdPost = await postsTestManager.createPost(createdBlog.id)
        // Incorrect title
        const dataToCreateOrUpdatePost = testDtosCreator.createPostDto({
            title: '10'.repeat(40),
            shortDescription: 'valid description',
            content: 'valid content',
            blogId: createdBlog.id,
        })
        // POST
        await request(app)
            .post(routerPaths.posts)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost)
            .expect(HttpStatusCodes.Bad_Request_400)
        //  PUT
        await request(app)
            .put(`${routerPaths.posts}/${createdPost.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost)
            .expect(HttpStatusCodes.Bad_Request_400)

        // Incorrect shortDescription
        const dataToCreateOrUpdatePost1 = testDtosCreator.createPostDto({
            title: 'valid title',
            shortDescription: '10'.repeat(100),
            content: 'valid content',
            blogId: createdBlog.blogId,
        })
        // POST
        await request(app)
            .post(routerPaths.posts)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost1)
            .expect(HttpStatusCodes.Bad_Request_400)
        //  PUT
        await request(app)
            .put(`${routerPaths.posts}/${createdPost.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost1)
            .expect(HttpStatusCodes.Bad_Request_400)

        // Incorrect content
        const dataToCreateOrUpdatePost2 = testDtosCreator.createPostDto({
            title: 'valid title',
            shortDescription: 'valid shortDescription',
            content: '10'.repeat(1000),
            blogId: createdBlog.blogId,
        })
        // POST
        await request(app)
            .post(routerPaths.posts)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost2)
            .expect(HttpStatusCodes.Bad_Request_400)
        //  PUT
        await request(app)
            .put(`${routerPaths.posts}/${createdPost.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost2)
            .expect(HttpStatusCodes.Bad_Request_400)

        // incorrect blogId
        const dataToCreateOrUpdatePost3: PostInputModel = testDtosCreator.createPostDto({
            title: 'valid title',
            shortDescription: 'valid shortDescription',
            content: 'valid Content',
            blogId: new ObjectId().toString(),
        })
        // POST
        await request(app)
            .post(routerPaths.posts)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost3)
            .expect(HttpStatusCodes.Bad_Request_400)
        //  PUT
        await request(app)
            .put(`${routerPaths.posts}/${createdPost.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost3)
            .expect(HttpStatusCodes.Bad_Request_400)

    })
    it('PUT, DELETE, GET should return error if id was not found, status 404', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const createdPost = await postsTestManager.createPost(createdBlog.id)

        const incorrectId = new ObjectId().toString()
        const dataToCreateOrUpdatePost = testDtosCreator
            .createPostDto({blogId: createdBlog.id})
        // PUT
        await request(app)
            .put(`${routerPaths.posts}/${incorrectId}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdatePost)
            .expect(HttpStatusCodes.Not_Found_404)
        // DELETE
        await request(app)
            .delete(`${routerPaths.posts}/${incorrectId}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .expect(HttpStatusCodes.Not_Found_404)
        // GET by id
        await request(app)
            .get(`${routerPaths.posts}/${incorrectId}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .expect(HttpStatusCodes.Not_Found_404)
    })
    it('GET should return all posts in DB, status 200 ', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        await postsTestManager.createPosts(createdBlog.id, 20)
        const {status, body: allPosts} = await request(app).get(routerPaths.posts).query({pageNumber: 2, pageSize: 4})
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(allPosts).toEqual(
            {
                pagesCount: 5,
                page: 2,
                pageSize: 4,
                totalCount: 20,
                items: expect.any(Array),
            })

    })
})