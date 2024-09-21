import {agent} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {BlogViewModel} from "../../src/models/blogs/BlogViewModel";

const req = agent(app)

export const blogsTestManager = {
    async getAllBlogs() {
        return req.get(SETTINGS.PATH.BLOGS)
    },
    async getBlogById(id: string) {
        return req.get(`${SETTINGS.PATH.BLOGS}/${id}`)
    },
    async createBlog(data: BlogInputModel) {
        return req.get(SETTINGS.PATH.BLOGS).send(data)
    },
    async updateBlog(data: BlogInputModel, id: string) {
        return req.get(`${SETTINGS.PATH.BLOGS}/${id}`).send(data)
    },
    async deleteBlogById(id: string) {
        return req.delete(`${SETTINGS.PATH.BLOGS}/${id}`)
    },
    async deleteAllBlogs() {
        return req.delete(SETTINGS.PATH.BLOGS)
    }
}