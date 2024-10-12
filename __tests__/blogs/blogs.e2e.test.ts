import {BlogInputModel} from "../../src/blogs/types/BlogInputModel";
import {blogsTestManager} from "./blogs.test.helpers";
import {agent} from "supertest";
import {app} from "../../src/app";
import {BlogViewModel} from "../../src/blogs/types/BlogViewModel";
import {BlogPostInputModel} from "../../src/blogs/types/BlogPostInputModel";
import {postsTestManager} from "../posts/posts.test.helpers";
import {routerPaths} from "../../src/common/path/path";
import {HttpStatusCodes} from "../../src/common/types/httpsStatusCodes";

const req = agent(app)

describe('hw4 /blogs', () => {
    beforeAll(async () => {
        await req.delete(routerPaths.testing)
    })
    let createdEntity: BlogViewModel
    it('POST =/blogs= should create a blog, status 201, return new blog', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
        }
        // POST
        const {status: createdBlog1Status, body: createdBlog1} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(createdBlog1Status).toEqual(HttpStatusCodes.Created_201)
        expect(createdBlog1).toEqual({
            id: expect.any(String),
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
            createdAt: expect.any(String),
            isMembership: false,
        })

        createdEntity = createdBlog1

        // GET by id
        const {status: getStatus, body: receivedBlog} = await blogsTestManager.getBlogById(createdBlog1.id)
        expect(getStatus).toEqual(HttpStatusCodes.OK_200)
        expect(receivedBlog).toEqual({
            id: expect.any(String),
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
            createdAt: expect.any(String),
            isMembership: false,})
    })
    it('PUT =/blogs/{blogId}= should update existing blog, status 204', async () => {
        const dataToUpdateBlog: BlogInputModel = {
            name: '1st upd blog',
            description: '1st upd description',
            webSiteUrl: 'http://localhost.1.upd.ru',
        }
        // PUT
        const {status: updatedStatus} = await blogsTestManager.updateBlog(dataToUpdateBlog, createdEntity.id)
        expect(updatedStatus).toEqual(HttpStatusCodes.No_Content_204)

        // GET by id, verify update
        const {status: receivedStatus, body: updatedBlog} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(receivedStatus).toEqual(HttpStatusCodes.OK_200)
        expect(updatedBlog).toEqual({
            id: expect.any(String),
            name: '1st upd blog',
            description: '1st upd description',
            webSiteUrl: 'http://localhost.1.upd.ru',
            createdAt: expect.any(String),
            isMembership: false,
        })
        createdEntity = updatedBlog
    })
    it('GET =/blogs/{blogId}= return blog by id, status 200', async () => {
        const {status: getStatus, body: receivedBlog} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(getStatus).toEqual(HttpStatusCodes.OK_200)
        expect(receivedBlog).toEqual({
            id: expect.any(String),
            name: '1st upd blog',
            description: '1st upd description',
            webSiteUrl: 'http://localhost.1.upd.ru',
            createdAt: expect.any(String),
            isMembership: false,
        })
    })
    it('POST =/blogs/{blogId}/posts= should create new post for existing blog, status 201', async () => {
        const dataToCreatePostForSpecificBlog: BlogPostInputModel = {
            title: '1st post',
            shortDescription: '1st post',
            content: 'content 1st post'
        }
        const {status: status1, body:createdPostOfBlog_1} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id,dataToCreatePostForSpecificBlog)
        expect(status1).toEqual(HttpStatusCodes.Created_201)
        expect(createdPostOfBlog_1).toEqual({
            id: expect.any(String),
            title: '1st post',
            shortDescription: '1st post',
            content: 'content 1st post',
            blogId: createdEntity.id,
            blogName: createdEntity.name,
            createdAt: expect.any(String)
        })
    })
    it('GET =/blogs/{blogId}/posts= should return all posts of existing blog, status 200', async () => {
        // Create two additional posts for existing blog
        const dataToCreatePostForSpecificBlog_1: BlogPostInputModel = {
            title: '2nd post',
            shortDescription: '2nd post',
            content: 'content 2nd post'
        }
        const dataToCreatePostForSpecificBlog_2: BlogPostInputModel = {
            title: '3rd post',
            shortDescription: '3rd post',
            content: 'content 3rd post'
        }
        // POST
        const {status: status1} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id, dataToCreatePostForSpecificBlog_1)
        expect(status1).toEqual(HttpStatusCodes.Created_201)
        const {status: status2} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id, dataToCreatePostForSpecificBlog_2)
        expect(status2).toEqual(HttpStatusCodes.Created_201)

        // Get all posts
        const {status: status3, body: body1} = await postsTestManager.getAllPosts()
        expect(status3).toEqual(HttpStatusCodes.OK_200)
        expect(body1.items.length).toEqual(3)

        // Get all posts of blog
        const {status, body} = await blogsTestManager.getPostsOfSpecificBlog(createdEntity.id)
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 3,
            items: [
                {
                    id: expect.any(String),
                    title: '3rd post',
                    shortDescription: '3rd post',
                    content: 'content 3rd post',
                    blogId: createdEntity.id,
                    blogName: createdEntity.name,
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    title: '2nd post',
                    shortDescription: '2nd post',
                    content: 'content 2nd post',
                    blogId: createdEntity.id,
                    blogName: createdEntity.name,
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    title: '1st post',
                    shortDescription: '1st post',
                    content: 'content 1st post',
                    blogId: createdEntity.id,
                    blogName: createdEntity.name,
                    createdAt: expect.any(String)
                }
            ]
        })
    })
    it('GET =/blogs= should return all blogs with pagination, status 200', async () => {
        // // POST
        // const dataToCreateBlog: BlogInputModel = {
        //     name: 'some name',
        //     description: 'some blog description',
        //     webSiteUrl: 'https://asdasda.ru',
        // }
        // const {status: createdStatus, body: createdBlog} = await blogsTestManager.createBlog(dataToCreateBlog)
        // expect(createdStatus).toEqual(HTTPStatusCodesEnum.Created_201)
        // expect(createdBlog).toEqual({
        //     id: expect.any(String),
        //     name: 'some name',
        //     description: 'some blog description',
        //     webSiteUrl: 'https://asdasda.ru',
        //     createdAt: expect.any(String),
        //     isMembership: false,
        // })

        // GET
        const {status, body} = await blogsTestManager.getAllBlogs()
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: expect.any(String),
                name: '1st upd blog',
                description: '1st upd description',
                webSiteUrl: 'http://localhost.1.upd.ru',
                createdAt: expect.any(String),
                isMembership: false
            }]
        })

    })
    it('DELETE =/blogs/{blogId}= should delete existing blog by id, status 204', async () => {
        // DELETE -> Удаляем createEntity !
        const {status} = await blogsTestManager.deleteBlogById(createdEntity.id)
        expect(status).toBe(HttpStatusCodes.No_Content_204)

        // GET
        const {status: status1} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(status1).toEqual(HttpStatusCodes.Not_Found_404)
    })
    it('POST,PUT,DELETE =/blogs= should not create/update/delete a blog with auth error, status 401', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '3rd blog',
            description: '3rd description',
            webSiteUrl: 'http://localhost.3.ru',
        }
        const dataToUpdateBlog = {
            name: '3rd upd blog',
            description: '3rd upd description',
            webSiteUrl: 'http://localhost.3.upd.ru',
        }
        // POST
        const{status} = await req.post(routerPaths.blogs).set({'Authorization': 'Basic uasdi1h3123'}).send(dataToCreateBlog)
        expect(status).toEqual(HttpStatusCodes.Unauthorized_401)

        // PUT
        // POST with correct auth data
        const {status: status1, body: createdBlog} = await blogsTestManager.createBlog(dataToCreateBlog)
        createdEntity = createdBlog

        const {status: status2} = await req
            .put(`${routerPaths.blogs}/${createdBlog.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(dataToUpdateBlog)
        expect(status2).toEqual(HttpStatusCodes.Unauthorized_401)

        // DELETE by id
        const {status: status3} = await req
            .delete(`${routerPaths.blogs}/${createdBlog.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
        expect(status3).toEqual(HttpStatusCodes.Unauthorized_401)
    })
    it('POST, PUT =/blogs= should not create a blog with validation error, status 400', async () => {
        // Incorrect name
        const dataToCreateOrUpdateBlog: BlogInputModel = {
            name: '4th blogdddddddddddddddddddddd',
            description: '4th description',
            webSiteUrl: 'http://localhost.3.ru',
        }
        // POST
        const {status: createdStatus, body} = await blogsTestManager.createBlog(dataToCreateOrUpdateBlog)
        expect(createdStatus).toEqual(HttpStatusCodes.Bad_Request_400)
        expect(body).toEqual(expect.any(Object))
        // PUT
        const {status:updatedStatus} = await blogsTestManager.updateBlog(dataToCreateOrUpdateBlog, body.id)
        expect(updatedStatus).toEqual(HttpStatusCodes.Bad_Request_400)


        // Incorrect description
        const descriptionString500: string = '4th description'.repeat(500)
        const dataToCreateOrUpdateBlog1: BlogInputModel = {
            name: '4th blog',
            description: descriptionString500,
            webSiteUrl: 'http://localhost.3.ru',
        }
        // POST
        const {status: createdStats1, body:body1} = await blogsTestManager.createBlog(dataToCreateOrUpdateBlog1)
        expect(createdStats1).toEqual(HttpStatusCodes.Bad_Request_400)
        expect(body1).toEqual(expect.any(Object))
        // PUT
        const {status:updatedStatus1} = await blogsTestManager.updateBlog(dataToCreateOrUpdateBlog1, body1.id)
        expect(updatedStatus1).toEqual(HttpStatusCodes.Bad_Request_400)

        // Incorrect webSiteUrl
        const dataToCreateOrUpdateBlog2: BlogInputModel = {
            name: '4th blog',
            description: descriptionString500,
            webSiteUrl: 'http//localhost',
        }
        // POST
        const {status: createdStatus2, body:body2} = await blogsTestManager.createBlog(dataToCreateOrUpdateBlog2)
        expect(createdStatus2).toEqual(HttpStatusCodes.Bad_Request_400)
        expect(body2).toEqual(expect.any(Object))
        // PUT
        const {status:updatedStatus2} = await blogsTestManager.updateBlog(dataToCreateOrUpdateBlog2, body2.id)
        expect(updatedStatus2).toEqual(HttpStatusCodes.Bad_Request_400)
    })
    it('POST =/blogs/{blogId}/posts= should not create a post for specific blog with validation error, status 400', async () => {
        // Incorrect title
        const incorrectTitle: string = '10'.repeat(40)
        const dataToCreatePostOfBlog: BlogPostInputModel = {
            title: incorrectTitle,
            shortDescription: 'valid description',
            content: 'valid content',
        }
        // POST
        const {status:incorrectTitlePOSTStatus} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id, dataToCreatePostOfBlog)
        expect(incorrectTitlePOSTStatus).toEqual(HttpStatusCodes.Bad_Request_400)


        // Incorrect shortDescription
        const incorrectShortDescription: string  = '10'.repeat(100)
        const dataToCreatePostOfBlog1: BlogPostInputModel = {
            title: 'valid title',
            shortDescription: incorrectShortDescription,
            content: 'valid content',
        }
        // POST
        const {status:incorrectShortDescriptionPOSTStatus} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id,dataToCreatePostOfBlog1)
        expect(incorrectShortDescriptionPOSTStatus).toEqual(HttpStatusCodes.Bad_Request_400)

        // Incorrect content
        const incorrectContent: string  = '10'.repeat(1000)
        const dataToCreatePostOfBlog2: BlogPostInputModel = {
            title: 'valid title',
            shortDescription: 'valid shortDescription',
            content: incorrectContent,
        }
        // POST
        const {status:incorrectContentPOSTStatus} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id,dataToCreatePostOfBlog2)
        expect(incorrectContentPOSTStatus).toEqual(HttpStatusCodes.Bad_Request_400)
    })
    it('PUT, DELETE, GET, should return error if id was not found; status 404', async () => {
        const dataToUpdateBlog: BlogInputModel = {
            name: '4th blogdddd',
            description: '4th description',
            webSiteUrl: 'http://localhost.3.ru',
        }
        // PUT
        const {status} = await blogsTestManager.updateBlog(dataToUpdateBlog, 'kjadfghlkjahfg')
        expect(status).toEqual(HttpStatusCodes.Not_Found_404)

        // DELETE
        const {status: status1} = await blogsTestManager.deleteBlogById('fdgjhnerkjlng')
        expect(status1).toEqual(HttpStatusCodes.Not_Found_404)

        // GET
        const {status: status2} = await blogsTestManager.getBlogById('sdfgsnbrthtyrhkm')
        expect(status2).toEqual(HttpStatusCodes.Not_Found_404)
    })
    it('GET, should return all blogs in DB, status 200 ', async () => {
        const {status, body:allBlogs} = await blogsTestManager.getAllBlogs()
        expect(status).toEqual(HttpStatusCodes.OK_200)
        expect(allBlogs).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: expect.any(Number),
                items: expect.any(Array),

        }
        )
    })
})

