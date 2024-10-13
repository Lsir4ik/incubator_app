import request from "supertest";
import {app} from "../../src/app";
import {PostInputModel} from "../../src/posts/types/PostInputModel";
import {routerPaths} from "../../src/common/path/path";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../src/auth/guards/base.auth.guard";
import {testDtosCreator} from "./testDtosCreator";
import {HttpStatusCodes} from "../../src/common/types/httpsStatusCodes";


export const postsTestManager = {
    async getPostById(id: string) {
        return request(app).get(`${routerPaths.posts}/${id}`)
    },
    async createPost(blogId: string, postDto?: PostInputModel) {
        // return request(app).post(routerPaths.posts).set({'Authorization': 'Basic ' + codeAuth}).send(data)
        const dto = postDto ?? testDtosCreator.createPostDto({blogId: blogId})
        const res = await request(app).post(routerPaths.posts).auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'} ).send({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId
        })
            .expect(HttpStatusCodes.Created_201)
        return (res.body)
    },
    async createPosts(blogId: string, count: number) {
        const posts = []
        for (let i = 1; i <= count; i++) {
            const res = await request(app)
                .post(routerPaths.posts)
                .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'})
                .send({
                    title: 'testPost' + i,
                    shortDescription: `testPost${i}ShortDescription`,
                    content: `testPost${i}Content`,
                    blogId: blogId,
                })
                .expect(HttpStatusCodes.Created_201)
            posts.push(res.body)
        }
        return posts
    },
    async updatePost(id: string, data:PostInputModel) {
        // return req.put(`${routerPaths.posts}/${id}`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
        return  request(app).put(`${routerPaths.posts}/${id}`).auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'} ).send(data)
    },
    async deletePostById(id: string) {
        // return req.delete(`${routerPaths.posts}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
        return  request(app).delete(`${routerPaths.posts}/${id}`).auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'} )
    }
}