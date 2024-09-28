import {agent} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {users} from "../../src/middlewares/authorization.middleware";
import {BlogPostInputModel} from "../../src/models/blogs/BlogPostInputModel";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const blogsTestManager = { // TODO как добавить search query
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
        return req.get(SETTINGS.PATH.BLOGS)
    },
    async getBlogById(id: string) {
        return req.get(`${SETTINGS.PATH.BLOGS}/${id}`)
    },
    async createBlog(data: BlogInputModel) {
        return req.post(SETTINGS.PATH.BLOGS).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async createPostForSpecificBlog(blogId: string, data: BlogPostInputModel) {
        return req.post( `${SETTINGS.PATH.BLOGS}/${blogId}/posts`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    // async getPostsOfSpecificBlog(blogId: string, // TODO как добавить search query
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
        return req.get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
    },
    async updateBlog(data: BlogInputModel, id: string) {
        return req.put(`${SETTINGS.PATH.BLOGS}/${id}`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async deleteBlogById(id: string) {
        return req.delete(`${SETTINGS.PATH.BLOGS}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
    },
    async deleteAllBlogs() {
        return req.delete(SETTINGS.PATH.BLOGS)
    }
}