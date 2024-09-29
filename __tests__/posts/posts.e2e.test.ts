import {agent} from "supertest";
import {app} from "../../src/app";
import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {PostInputModel} from "../../src/models/posts/PostInputModel";
import {PostViewModel} from "../../src/models/posts/PostViewModel";
import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {blogsTestManager} from "../blogs/blogs.test.helpers";
import {postsTestManager} from "./posts.test.helpers";

const req = agent(app)

describe('/posts', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })

    let createdEntity: PostViewModel
    it('POST, should create a post, status 201', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
        }
        // POST blogs
        const {status: createdBlogStatus, body: createdBlog} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(createdBlogStatus).toBe(HTTPStatusCodesEnum.Created_201)

        const dataToCreatePost: PostInputModel = {
            title: '1st Post',
            shortDescription: '1st Post description',
            content: '1st Post content',
            blogId: createdBlog.id,
        }
        // POST posts
        const {status: createdPostStatus, body: createdPost} = await postsTestManager.createPost(dataToCreatePost)
        expect(createdPostStatus).toBe(HTTPStatusCodesEnum.Created_201)
        expect(createdPost).toEqual({
            id: createdPost.id,
            title: '1st Post',
            shortDescription: '1st Post description',
            content: '1st Post content',
            blogId: createdPost.blogId,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        })

        createdEntity = createdPost
    })
    it('PUT, should update existing blog, status 204', async () => {
        const dataToUpdatePost: PostInputModel = {
            title: '1st upd Post',
            shortDescription: '1st Post updated description',
            content: '1st Post updated content',
            blogId: createdEntity.blogId,
        }
        const {status} = await postsTestManager.updatePost(createdEntity.id, dataToUpdatePost)
        expect(status).toEqual(HTTPStatusCodesEnum.No_Content_204)
    })
    it('DELETE, should delete existing post by id, status 204', async () => {
        // DELETE -> Удаляем createEntity !
        const {status} = await postsTestManager.deletePostById(createdEntity.id)
        expect(status).toBe(HTTPStatusCodesEnum.No_Content_204)

        // GET
        const {status: status1} = await postsTestManager.getPostById(createdEntity.id)
        expect(status1).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('GET, should return created post, status 200', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '2nd blog',
            description: '2nd description',
            webSiteUrl: 'http://localhost.1.ru',
        }
        // POST blogs
        const {status: createdBlogStatus, body: createdBlog} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(createdBlogStatus).toBe(HTTPStatusCodesEnum.Created_201)

        const dataToCreatePost: PostInputModel = {
            title: '2nd Post',
            shortDescription: '2nd Post description',
            content: '2nd Post content',
            blogId: createdBlog.id,
        }
        // POST posts
        const {status: createdPostStatus, body: createdPost} = await postsTestManager.createPost(dataToCreatePost)
        expect(createdPostStatus).toBe(HTTPStatusCodesEnum.Created_201)
        expect(createdPost).toEqual({
            id: createdPost.id,
            ...dataToCreatePost,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        })

        // GET by id
        const {status: status1, body: createdPost1} = await postsTestManager.getPostById(createdPost.id)
        expect(status1).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(createdPost1).toEqual({
            _id: expect.any(String),
            id: createdPost.id,
            ...dataToCreatePost,
            blogName: createdPost.blogName,
            createdAt: createdPost.createdAt
        })

        // Переприсваеваем createdEntity
        createdEntity = createdPost
    })
    it('POST, PUT, DELETE should not create/update/delete a post with auth error, status 401', async () => {
        const dataToCreateOpUpdatePost: PostInputModel = {
            title: '3rd Post',
            shortDescription: '3rd Post description',
            content: '3rd Post content',
            blogId: createdEntity.blogId,
        }
        // POST
        const {status} = await req.post(SETTINGS.PATH.POSTS).set({'Authorization': 'Basic uasdi1h3123'}).send(dataToCreateOpUpdatePost)
        expect(status).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        // PUT
        const {status: status1} = await req
            .put(`${SETTINGS.PATH.POSTS}/${createdEntity.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(dataToCreateOpUpdatePost)
        expect(status1).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        // DELETE by id
        const {status: status2} = await req
            .delete(`${SETTINGS.PATH.POSTS}/${createdEntity.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
        expect(status2).toEqual(HTTPStatusCodesEnum.Unauthorized_401)
    })
    it('POST, PUT, should not create a post with validation error, status 400', async () => {
        // Incorrect title
        const incorrectTitle: string = '10'.repeat(40)
        const dataToCreateOrUpdatePost: PostInputModel = {
            title: incorrectTitle,
            shortDescription: 'valid description',
            content: 'valid content',
            blogId: createdEntity.blogId,
        }
        // POST
        const {status:incorrectTitlePOSTStatus} = await postsTestManager.createPost(dataToCreateOrUpdatePost)
        expect(incorrectTitlePOSTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        //  PUT
        const {status: incorrectTitlePUTStatus} = await postsTestManager.updatePost(createdEntity.id,dataToCreateOrUpdatePost)
        expect(incorrectTitlePUTStatus).toBe(HTTPStatusCodesEnum.Bad_Request_400)

        // Incorrect shortDescription
        const incorrectShortDescription: string  = '10'.repeat(100)
        const dataToCreateOrUpdatePost1: PostInputModel = {
            title: 'valid title',
            shortDescription: incorrectShortDescription,
            content: 'valid content',
            blogId: createdEntity.blogId,
        }
        // POST
        const {status:incorrectShortDescriptionPOSTStatus} = await postsTestManager.createPost(dataToCreateOrUpdatePost1)
        expect(incorrectShortDescriptionPOSTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        //  PUT
        const {status:incorrectShortDescriptionPUTStatus} = await postsTestManager.updatePost(createdEntity.id,dataToCreateOrUpdatePost1)
        expect(incorrectShortDescriptionPUTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        // Incorrect content
        const incorrectContent: string  = '10'.repeat(1000)
        const dataToCreateOrUpdatePost2: PostInputModel = {
            title: 'valid title',
            shortDescription: 'valid shortDescription',
            content: incorrectContent,
            blogId: createdEntity.blogId,
        }
        // POST
        const {status:incorrectContentPOSTStatus} = await postsTestManager.createPost(dataToCreateOrUpdatePost2)
        expect(incorrectContentPOSTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        //  PUT
        const {status:incorrectContentPUTStatus} = await postsTestManager.updatePost(createdEntity.id,dataToCreateOrUpdatePost2)
        expect(incorrectContentPUTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        // incorrect blogId
        const incorrectBlogId: string  = 'sdfkjndfagkjlsrtnegkj'
        const dataToCreateOrUpdatePost3: PostInputModel = {
            title: 'valid title',
            shortDescription: 'valid shortDescription',
            content:  'valid Content',
            blogId: incorrectBlogId,
        }
        // POST
        const {status:incorrectBlogIdPOSTStatus} = await postsTestManager.createPost(dataToCreateOrUpdatePost3)
        expect(incorrectBlogIdPOSTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        //  PUT
        const {status:incorrectBlogIdPUTStatus} = await postsTestManager.updatePost(createdEntity.id,dataToCreateOrUpdatePost3)
        expect(incorrectBlogIdPUTStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

    })
    it('PUT, DELETE, GET should return error id id was not found, status 404', async () => {
        const dataToCreateOrUpdatePost: PostInputModel = {
            title: '1st Post',
            shortDescription: '1st Post description',
            content: '1st Post content',
            blogId: createdEntity.blogId,
        }
        // PUT
        const {status:updatedStatus} = await postsTestManager.updatePost('sgfdhsfghdfsgh', dataToCreateOrUpdatePost)
        expect(updatedStatus).toEqual(HTTPStatusCodesEnum.Not_Found_404)
        // DELETE
        const{status:deletedStatus} = await postsTestManager.deletePostById('sdfgdfhgfsghj')
        expect(deletedStatus).toEqual(HTTPStatusCodesEnum.Not_Found_404)
        // GET by id
        const {status:readStatus} = await postsTestManager.getPostById('dfghfsghdfghj')
        expect(readStatus).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('GET should return all posts in DB, status 200 ', async () => {
        const {status, body:allPosts} = await postsTestManager.getAllPosts()
        expect(status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(allPosts).toEqual(
            {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: expect.any(Number),
            items: expect.any(Array),
        })

    })
})