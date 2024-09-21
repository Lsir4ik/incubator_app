import {agent} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {users} from "../../src/middlewares/authorization.middleware";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const blogsTestManager = {
    async getAllBlogs() {
        return req.get(SETTINGS.PATH.BLOGS)
    },
    async getBlogById(id: string) {
        return req.get(`${SETTINGS.PATH.BLOGS}/${id}`)
    },
    async createBlog(data: BlogInputModel) {
        return req.post(SETTINGS.PATH.BLOGS).set({'Authorization': 'Basic ' + codeAuth}).send(data)
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