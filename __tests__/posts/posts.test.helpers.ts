import {agent} from "supertest";
import {app} from "../../src/app";
import {PostInputModel} from "../../src/posts/types/PostInputModel";
import {users} from "../../src/auth/guards/base.auth.guard";
import {routerPaths} from "../../src/common/path/path";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const postsTestManager = {
    async getAllPosts() {
        return req.get(routerPaths.posts)
    },
    async getPostById(id: string) {
        return req.get(`${routerPaths.posts}/${id}`)
    },
    async createPost(data: PostInputModel) {
        return req.post(routerPaths.posts).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async updatePost(id: string, data:PostInputModel) {
        return req.put(`${routerPaths.posts}/${id}`).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async deletePostById(id: string) {
        return req.delete(`${routerPaths.posts}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
    },
    async deleteAllPosts() {
        return req.delete(routerPaths.posts)
    },
}