import {agent} from "supertest";
import {app} from "../../src/app";
import {SETTINGS} from "../../src/settings";
import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";

const req = agent(app)

const blogsTestManager = {
    async getAllBlogs() {
        return req.get(SETTINGS.PATH.BLOGS)
    },
    async getBlogById(id: string) {
        return req.get(`${SETTINGS.PATH.BLOGS}/${id}`)
    },
    async createBlog(data: BlogInputModel) {

    },
    async updateBlog(data: BlogInputModel) {

    },
    async deleteBlogById(id: string) {
        return req.delete(`${SETTINGS.PATH.BLOGS}/${id}`)
    },
    async deleteAllBlogs() {
        return req.delete(SETTINGS.PATH.BLOGS)
    }
}