import {agent} from "supertest";
import {app} from "../../src/app";
import {users} from "../../src/middlewares/authorization.middleware";
import {SETTINGS} from "../../src/settings";
import {UserInputModel} from "../../src/models/users/UserInputModel";

const req = agent(app)

let data = `${users[0].login}:${users[0].password}`
let buff = Buffer.from(data)
let codeAuth = buff.toString('base64')

export const usersTestManager = {
    async getAllUsers(){
        return req.get(SETTINGS.PATH.USERS).set({'Authorization': 'Basic ' + codeAuth})
    },
    async createUser(data: UserInputModel) {
        return req.post(SETTINGS.PATH.USERS).set({'Authorization': 'Basic ' + codeAuth}).send(data)
    },
    async deleteUserById(id: string) {
        return req.delete(`${SETTINGS.PATH.USERS}/${id}`).set({'Authorization': 'Basic ' + codeAuth})
    }
}