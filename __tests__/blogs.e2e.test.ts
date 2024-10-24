import {BlogInputModel} from "../src/blogs/types/BlogInputModel";
import {blogsTestManager} from "./utils/blogs.test.helpers";
import request from "supertest";
import {app} from "../src/app";
import {BlogPostInputModel} from "../src/blogs/types/BlogPostInputModel";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import {testDtosCreator} from "./utils/testDtosCreator";
import {ADMIN_LOGIN, ADMIN_PASS} from "../src/auth/guards/base.auth.guard";
import {ObjectId} from "mongodb";


describe('Blogs', () => {
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

    it('POST =/blogs= should create a blog, status 201, return new blog', async () => {
        // POST
        const createdBlog = await blogsTestManager.createBlog()
        expect(createdBlog).toEqual({
            id: expect.any(String),
            name: 'testBlog',
            description: 'testBlogDescription',
            websiteUrl: 'http://testBlog.com',
            createdAt: expect.any(String),
            isMembership: false,
        })

        // GET by id
        const {status: getStatus, body: receivedBlog} = await blogsTestManager.getBlogById(createdBlog.id)
        expect(getStatus).toEqual(HttpStatusCodes.OK_200)
        expect(receivedBlog).toEqual({
            id: expect.any(String),
            name: 'testBlog',
            description: 'testBlogDescription',
            websiteUrl: 'http://testBlog.com',
            createdAt: expect.any(String),
            isMembership: false,
        })
    })
    it('PUT =/blogs/{blogId}= should update existing blog, status 204', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const updateBlogDto: BlogInputModel = testDtosCreator.createBlogDto({
            name: 'testBlog_upd',
            description: 'testBlog_upd_Description',
            websiteUrl: 'https://testBlog.upd.com',
        })
        // PUT
        const {status: updatedStatus} = await blogsTestManager.updateBlog(updateBlogDto, createdBlog.id)
        expect(updatedStatus).toEqual(HttpStatusCodes.No_Content_204)

        // GET by id, verify update
        const {status: receivedStatus, body: updatedBlog} = await blogsTestManager.getBlogById(createdBlog.id)
        expect(receivedStatus).toEqual(HttpStatusCodes.OK_200)
        expect(updatedBlog).toEqual({
            id: expect.any(String),
            name: 'testBlog_upd',
            description: 'testBlog_upd_Description',
            websiteUrl: 'https://testBlog.upd.com',
            createdAt: expect.any(String),
            isMembership: false,
        })
    })
    it('GET =/blogs/{blogId}= return blog by id, status 200', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const {status: getStatus, body: receivedBlog} = await blogsTestManager.getBlogById(createdBlog.id)
        expect(getStatus).toEqual(HttpStatusCodes.OK_200)
        expect(receivedBlog).toEqual({
            id: expect.any(String),
            name: 'testBlog',
            description: 'testBlogDescription',
            websiteUrl: 'http://testBlog.com',
            createdAt: expect.any(String),
            isMembership: false,
        })
    })
    it('POST =/blogs/{blogId}/posts= should create new post for existing blog, status 201', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const createdPostOfBlog = await blogsTestManager.createPostForSpecificBlog(createdBlog.id)
        expect(createdPostOfBlog).toEqual({
            id: expect.any(String),
            title: 'testBlogPost',
            shortDescription: 'testBlogPost shortDescription',
            content: 'testBlogPost content',
            blogId: createdBlog.id,
            blogName: createdBlog.name,
            createdAt: expect.any(String)
        })
    })
    it('GET =/blogs/{blogId}/posts= should return all posts of existing blog, status 200', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        // Create two additional posts for existing blog
        const arrOfPostsOfBlog = await blogsTestManager.createPostsForBlog(createdBlog.id, 3)

        // Get all posts
        const {status: status3, body: body1} = await request(app).get(routerPaths.posts)
        expect(status3).toEqual(HttpStatusCodes.OK_200)
        expect(body1.items.length).toEqual(3)

        // Get all posts of blog
        const {status, body} = await request(app).get(`${routerPaths.blogs}/${createdBlog.id}/posts`)
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 3,
            items: [
                {
                    id: expect.any(String),
                    title: 'testPostOfBlog3',
                    shortDescription: 'testPostOfBlog3 shortDescription',
                    content: 'testPostOfBlog3 content',
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    title: 'testPostOfBlog2',
                    shortDescription: 'testPostOfBlog2 shortDescription',
                    content: 'testPostOfBlog2 content',
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    title: 'testPostOfBlog1',
                    shortDescription: 'testPostOfBlog1 shortDescription',
                    content: 'testPostOfBlog1 content',
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                    createdAt: expect.any(String)
                }
            ]
        })
    })
    it('GET =/blogs= should return all blogs with pagination, status 200', async () => {
        // GET
        const arrOfBlogs = await blogsTestManager.createBlogs(1)

        const {status, body} = await request(app).get(routerPaths.blogs)
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: expect.any(String),
                name: 'testBlog1',
                description: 'testBlog1Description',
                websiteUrl: 'http://testBlog1.com',
                createdAt: expect.any(String),
                isMembership: false
            }]
        })

    })
    it('DELETE =/blogs/{blogId}= should delete existing blog by id, status 204', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const {status} = await blogsTestManager.deleteBlogById(createdBlog.id)
        expect(status).toBe(HttpStatusCodes.No_Content_204)

        // GET
        const {status: status1} = await blogsTestManager.getBlogById(createdBlog.id)
        expect(status1).toEqual(HttpStatusCodes.Not_Found_404)
    })
    it('POST,PUT,DELETE =/blogs= should not create/update/delete a blog with auth error, status 401', async () => {
        const createdBlog = await blogsTestManager.createBlog()

        const dataToCreateOrUpdateBlog = testDtosCreator.createBlogDto({})
        // POST
        const {status} = await request(app).post(routerPaths.blogs)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(dataToCreateOrUpdateBlog)
        expect(status).toEqual(HttpStatusCodes.Unauthorized_401)

        // PUT
        const {status: status2} = await request(app)
            .put(`${routerPaths.blogs}/${createdBlog.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(dataToCreateOrUpdateBlog)
        expect(status2).toEqual(HttpStatusCodes.Unauthorized_401)

        // DELETE by id
        const {status: status3} = await request(app)
            .delete(`${routerPaths.blogs}/${createdBlog.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
        expect(status3).toEqual(HttpStatusCodes.Unauthorized_401)
    })
    it('POST, PUT =/blogs= should not create a blog with validation error, status 400', async () => {

        // Incorrect name
        const dataToCreateOrUpdateBlog = testDtosCreator.createBlogDto({name: '4th blogdddddddddddddddddddddd'})
        // POST
        await request(app)
            .post(routerPaths.blogs)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdateBlog)
            .expect(HttpStatusCodes.Bad_Request_400)
        // PUT
        const createdBlog = await blogsTestManager.createBlog()
        await request(app)
            .put(`${routerPaths.blogs}/${createdBlog.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdateBlog)
            .expect(HttpStatusCodes.Bad_Request_400)

        // Incorrect description
        const dataToCreateOrUpdateBlog1: BlogInputModel = testDtosCreator
            .createBlogDto({description: '4th description'.repeat(500)})
        // POST
        await request(app)
            .post(routerPaths.blogs)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdateBlog1)
            .expect(HttpStatusCodes.Bad_Request_400)
        // PUT
        await request(app)
            .put(`${routerPaths.blogs}/${createdBlog.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdateBlog1)
            .expect(HttpStatusCodes.Bad_Request_400)

        // Incorrect webSiteUrl
        const dataToCreateOrUpdateBlog2: BlogInputModel = testDtosCreator.createBlogDto(
            {websiteUrl: 'http//localhost'})
        // POST
        await request(app)
            .post(routerPaths.blogs)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdateBlog2)
            .expect(HttpStatusCodes.Bad_Request_400)
        // PUT
        await request(app)
            .put(`${routerPaths.blogs}/${createdBlog.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateOrUpdateBlog2)
            .expect(HttpStatusCodes.Bad_Request_400)
    })
    it('POST =/blogs/{blogId}/posts= should not create a post for specific blog with validation error, status 400', async () => {
        const createdBlog = await blogsTestManager.createBlog()

        // Incorrect title
        const dataToCreatePostOfBlog: BlogPostInputModel = testDtosCreator.createBlogPostDto({title: '10'.repeat(40)})
        // POST
        await request(app).post(`${routerPaths.blogs}/${createdBlog.id}/posts`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .set(dataToCreatePostOfBlog)
            .expect(HttpStatusCodes.Bad_Request_400)

        // Incorrect shortDescription
        const dataToCreatePostOfBlog1: BlogPostInputModel = testDtosCreator.createBlogPostDto({shortDescription: '10'.repeat(100)})
        // POST
        await request(app).post(`${routerPaths.blogs}/${createdBlog.id}/posts`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .set(dataToCreatePostOfBlog1)
            .expect(HttpStatusCodes.Bad_Request_400)

        // Incorrect content
        const dataToCreatePostOfBlog2: BlogPostInputModel = testDtosCreator.createBlogPostDto({content: '10'.repeat(1000)})
        // POST
        await request(app).post(`${routerPaths.blogs}/${createdBlog.id}/posts`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .set(dataToCreatePostOfBlog2)
            .expect(HttpStatusCodes.Bad_Request_400)
    })
    it('PUT, DELETE, GET, should return error if id was not found; status 404', async () => {
        const createdBlog = await blogsTestManager.createBlog()
        const randomObjectId = new ObjectId().toString()
        const dataToUpdateBlog = testDtosCreator.createBlogDto({})
        // PUT
        await request(app).put(`${routerPaths.blogs}/${randomObjectId}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToUpdateBlog)
            .expect(HttpStatusCodes.Not_Found_404)

        // DELETE
        await request(app).delete(`${routerPaths.blogs}/${randomObjectId}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .expect(HttpStatusCodes.Not_Found_404)

        // GET
        await request(app).get(`${routerPaths.blogs}/${randomObjectId}`)
            .expect(HttpStatusCodes.Not_Found_404)
    })
    it('GET, should return all blogs in DB, status 200 ', async () => {
        await blogsTestManager.createBlogs(10)
        const {status, body: allBlogs} = await request(app).get(routerPaths.blogs).query({pageNumber: 2, pageSize: 4})
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(allBlogs).toEqual({
                pagesCount: 3,
                page: 2,
                pageSize: 4,
                totalCount: 10,
                items: expect.any(Array),
            }
        )
    })
})

