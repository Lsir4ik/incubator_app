import request from "supertest";
import {app} from "../../src/app";
import {BlogInputModel} from "../../src/blogs/types/BlogInputModel";
import {BlogPostInputModel} from "../../src/blogs/types/BlogPostInputModel";
import {routerPaths} from "../../src/common/path/path";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../src/auth/guards/base.auth.guard";
import {testDtosCreator} from "./testDtosCreator";
import {HttpStatusCodes} from "../../src/common/types/httpsStatusCodes";


export const blogsTestManager = {
    async getBlogById(id: string) {
        return request(app)
            .get(`${routerPaths.blogs}/${id}`)
    },
    async createBlog(blogDto?: BlogInputModel) {
        // return req.post(routerPaths.blogs).set({'Authorization': 'Basic ' + codeAuth}).send(data)
        const dto = blogDto ?? testDtosCreator.createBlogDto({})
        const res = await request(app).post(routerPaths.blogs)
            .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'} )
            .send({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        })
            .expect(HttpStatusCodes.Created_201)
        return res.body
    },
    async createBlogs(count: number) {
        const blogs = []
        for (let i = 1; i <= count; i++) {
            const res = await request(app)
                .post(routerPaths.blogs)
                .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'})
                .send({
                    name: 'testBlog' + i,
                    description: `testBlog${i}Description`,
                    websiteUrl: `http://testBlog${i}.com`,
                })
                .expect(HttpStatusCodes.Created_201)

            blogs.push(res.body)
        }
        return blogs
    },
    async createPostForSpecificBlog(blogId: string, postForBlogDto?: BlogPostInputModel) {
        // return req.post( `${routerPaths.blogs}/${blogId}/posts`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
        const dto = postForBlogDto ?? testDtosCreator.createBlogPostDto({})
        const res = await request(app)
            .post( `${routerPaths.blogs}/${blogId}/posts`)
            .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'})
            .send({
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
            })
            .expect(HttpStatusCodes.Created_201)
        return res.body
    },
    async createPostsForBlog(blogId: string, count: number) {
        const postsOfBlog = []
        for (let i = 1; i <= count; i++) {
            const res = await request(app)
                .post(`${routerPaths.blogs}/${blogId}/posts`)
                .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'})
                .send({
                    title: 'testPostOfBlog' + i,
                    shortDescription: `testPostOfBlog${i} shortDescription`,
                    content: `testPostOfBlog${i} content`,
                })
            postsOfBlog.push(res.body)
        }
        return postsOfBlog
    },
    async updateBlog(data: BlogInputModel, id: string) {
        // return request(app).put(`${routerPaths.blogs}/${id}`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
        return request(app).put(`${routerPaths.blogs}/${id}`).auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'}).send(data)
    },
    async deleteBlogById(id: string) {
        // return request(app).delete(`${routerPaths.blogs}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
        return request(app).delete(`${routerPaths.blogs}/${id}`).auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'})
    }
}