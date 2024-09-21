import {agent} from "supertest";
import {app} from "../../src/app";
import {PostInputModel} from "../../src/models/posts/PostInputModel";
import {SETTINGS} from "../../src/settings";

const req = agent(app)

export const postsTestManager = {
    async getAllPosts() {
        return req.get(SETTINGS.PATH.POSTS)
    },
    async getPostById(id: string) {
        return req.get(`${SETTINGS.PATH.POSTS}/${id}`)
    },
    async createPost(data: PostInputModel) {
        return req.post(SETTINGS.PATH.POSTS).send(data)
    },
    async updatePost(id: string, data:PostInputModel) {
        return req.put(`${SETTINGS.PATH.POSTS}/${id}`).send(data)
    },
    async deletePostById(id: string) {
        return req.delete(`${SETTINGS.PATH.POSTS}/${id}`)
    },
    async deleteAllPosts() {
        return req.delete(SETTINGS.PATH.POSTS)
    },
}