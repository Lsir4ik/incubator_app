import request from "supertest";
import {app} from "../../src/app";
import {ADMIN_LOGIN, ADMIN_PASS} from "../../src/auth/guards/base.auth.guard";
import {UserInputModel} from "../../src/users/types/UserInputModel";
import {routerPaths} from "../../src/common/path/path";
import {testDtosCreator} from "./testDtosCreator";
import {HttpStatusCodes} from "../../src/common/types/httpsStatusCodes";


export const usersTestManager = {
    async createUser(userDto?: UserInputModel) {
        const dto = userDto ?? testDtosCreator.createUserDto({})
        const res = await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'} )
            .send({
                login: dto.login,
                email: dto.email,
                password: dto.password,
            })
            .expect(HttpStatusCodes.Created_201)

        return  res.body
    },
    async createUsers(count: number) {
        const users = []
        for (let i = 1; i <= count; i++) {
            const res = await request(app)
                .post(routerPaths.users)
                .auth(ADMIN_LOGIN, ADMIN_PASS,{type: 'basic'})
                .send({
                    login: 'testUser' + i,
                    email: `testUser${i}@gmail.com`,
                    password: 'qwerty',
                })
                .expect(HttpStatusCodes.Created_201)
            users.push(res.body)
        }
        return users
    }
}