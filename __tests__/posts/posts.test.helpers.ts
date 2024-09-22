import {agent} from "supertest";
import {app} from "../../src/app";
import {PostInputModel} from "../../src/models/posts/PostInputModel";
import {SETTINGS} from "../../src/settings";
import {users} from "../../src/middlewares/authorization.middleware";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const postsTestManager = {
    async getAllPosts() {
        return req.get(SETTINGS.PATH.POSTS)
    },
    async getPostById(id: string) {
        return req.get(`${SETTINGS.PATH.POSTS}/${id}`)
    },
    async createPost(data: PostInputModel) {
        return req.post(SETTINGS.PATH.POSTS).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async updatePost(id: string, data:PostInputModel) {
        return req.put(`${SETTINGS.PATH.POSTS}/${id}`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async deletePostById(id: string) {
        return req.delete(`${SETTINGS.PATH.POSTS}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
    },
    async deleteAllPosts() {
        return req.delete(SETTINGS.PATH.POSTS)
    },
}