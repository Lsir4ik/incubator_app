import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {blogsTestManager} from "./blogs.test.helpers";
import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";
import {BlogViewModel} from "../../src/models/blogs/BlogViewModel";
import {BlogPostInputModel} from "../../src/models/blogs/BlogPostInputModel";
import {postsTestManager} from "../posts/posts.test.helpers";

const req = agent(app)

describe('hw4 /blogs', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })
    let createdEntity: BlogViewModel
    it('POST /blogs should create a blog, status 201, return new blog', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
        }
        // POST
        const {status: createdBlog1Status, body: createdBlog1} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(createdBlog1Status).toEqual(HTTPStatusCodesEnum.Created_201)
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
        expect(getStatus).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(receivedBlog).toEqual({
            id: expect.any(String),
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
            createdAt: expect.any(String),
            isMembership: false,})
    })
    it('PUT /blogs should update existing blog, status 204', async () => {
        const dataToUpdateBlog: BlogInputModel = {
            name: '1st upd blog',
            description: '1st upd description',
            webSiteUrl: 'http://localhost.1.upd.ru',
        }
        // PUT
        const {status: updatedStatus} = await blogsTestManager.updateBlog(dataToUpdateBlog, createdEntity.id)
        expect(updatedStatus).toEqual(HTTPStatusCodesEnum.No_Content_204)

        // GET by id, verify update
        const {status: receivedStatus, body: updatedBlog} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(receivedStatus).toEqual(HTTPStatusCodesEnum.OK_200)
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
    it('GET /blogs/{blogId} return blog by id, status 200', async () => {
        const {status: getStatus, body: receivedBlog} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(getStatus).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(receivedBlog).toEqual({
            id: expect.any(String),
            name: '1st upd blog',
            description: '1st upd description',
            webSiteUrl: 'http://localhost.1.upd.ru',
            createdAt: expect.any(String),
            isMembership: false,
        })
    })
    it('POST /blogs/{blogId}/posts should create new post for existing blog, status 201', async () => {
        const dataToCreatePostForSpecificBlog: BlogPostInputModel = {
            title: '1st post',
            shortDescription: '1st post',
            content: 'content 1st post'
        }
        const {status: status1, body:createdPostOfBlog_1} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id,dataToCreatePostForSpecificBlog)
        expect(status1).toEqual(HTTPStatusCodesEnum.Created_201)
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
    it('GET /blogs/{blogId}/posts should return all posts of existing blog, status 200', async () => {
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
        expect(status1).toEqual(HTTPStatusCodesEnum.Created_201)
        const {status: status2} = await blogsTestManager.createPostForSpecificBlog(createdEntity.id, dataToCreatePostForSpecificBlog_2)
        expect(status2).toEqual(HTTPStatusCodesEnum.Created_201)

        // Get all posts
        const {status: status3, body: body1} = await postsTestManager.getAllPosts()
        expect(status3).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(body1.items.length).toEqual(3)

        // Get all posts of blog
        const {status, body} = await blogsTestManager.getPostsOfSpecificBlog(createdEntity.id)
        expect(status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 3,
            items: [
                {
                    id: expect.any(String),
                    title: '1st post',
                    shortDescription: '1st post', // TODO порядок при тестах не тот
                    content: 'content 1st post',
                    blogId: createdEntity.id,
                    blogName: createdEntity.name,
                    createdAt: expect.any(String)
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
                    title: '3rd post',
                    shortDescription: '3rd post',
                    content: 'content 3rd post',
                    blogId: createdEntity.id,
                    blogName: createdEntity.name,
                    createdAt: expect.any(String),
                }
            ]
        })
    })
    it('GET /blogs should return all blogs with pagination, status 200', async () => {
        const {status, body} = await blogsTestManager.getAllBlogs() // TODO как добавить пагинацию в query
        expect(status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: expect.any(String),
                name: '1st blog',
                description: '1st description',
                webSiteUrl: 'http://localhost.1.ru',
                createdAt: expect.any(String),
                isMembership: false,
            }]
        })

    })
    it('DELETE /blogs should delete existing blog by id, status 204', async () => {
        // DELETE -> Удаляем createEntity !
        const {status} = await blogsTestManager.deleteBlogById(createdEntity.id)
        expect(status).toBe(HTTPStatusCodesEnum.No_Content_204)

        // GET
        const {status: status1} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(status1).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('POST, PUT, DELETE should not create/update/delete blog with auth error, status 404', async () => {

    })

})

