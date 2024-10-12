import {agent} from "supertest";
import {app} from "../../src/app";
import {users} from "../../src/auth/guards/base.auth.guard";
import {UserInputModel} from "../../src/users/types/UserInputModel";
import {routerPaths} from "../../src/common/path/path";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const usersTestManager = {
    async getAllUsers(){
        return req.get(routerPaths.users).set({'Authorization': 'Basic ' + codeAuth})
    },
    async createUser(data: UserInputModel) {
        return req.post(routerPaths.users).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async deleteUserById(id: string) {
        return req.delete(`${routerPaths.users}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
    }
}