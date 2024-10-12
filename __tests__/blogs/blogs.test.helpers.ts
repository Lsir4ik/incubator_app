import {agent} from "supertest";
import {app} from "../../src/app";
import {BlogInputModel} from "../../src/blogs/types/BlogInputModel";
import {users} from "../../src/auth/guards/base.auth.guard";
import {BlogPostInputModel} from "../../src/blogs/types/BlogPostInputModel";
import {routerPaths} from "../../src/common/path/path";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const blogsTestManager = {
    // async getAllBlogs(searchNameTerm: string = 'null',
    //                   sortBy: string = 'createdAt',
    //                   sortDirection: string = 'desc',
    //                   pageNumber: string = '1',
    //                   pageSize: string = '10',
    //                   ) {
    //     return req.get(`${SETTINGS.PATH.BLOGS}
    //     ?searchNameTerm=${searchNameTerm}
    //     &sortBy=${sortBy}
    //     &sortDirection=${sortDirection}
    //     &pageNumber=${pageNumber}
    //     &pageSize=${pageSize}`)
    // },
    async getAllBlogs() {
        return req.get(routerPaths.blogs)
    },
    async getBlogById(id: string) {
        return req.get(`${routerPaths.blogs}/${id}`)
    },
    async createBlog(data: BlogInputModel) {
        return req.post(routerPaths.blogs).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async createPostForSpecificBlog(blogId: string, data: BlogPostInputModel) {
        return req.post( `${routerPaths.blogs}/${blogId}/posts`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    // async getPostsOfSpecificBlog(blogId: string,
    //                              pageNumber: string = '1',
    //                              pageSize: string = '10',
    //                              sortBy: string = 'createdAt',
    //                              sortDirection: string = 'desc') {
    //     return req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts
    //     ?pageNumber=${pageNumber}
    //     &pageSize=${pageSize}
    //     &sortBy=${sortBy}
    //     &sortDirection=${sortDirection}`)
    // },
    async getPostsOfSpecificBlog(blogId: string) {
        return req.get(`${routerPaths.blogs}/${blogId}/posts`)
    },
    async updateBlog(data: BlogInputModel, id: string) {
        return req.put(`${routerPaths.blogs}/${id}`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async deleteBlogById(id: string) {
        return req.delete(`${routerPaths.blogs}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
    },
    async deleteAllBlogs() {
        return req.delete(routerPaths.blogs)
    }
}