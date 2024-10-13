import request, {agent} from "supertest";
import {app} from "../src/app";
import {UserInputModel} from "../src/users/types/UserInputModel";
import {usersTestManager} from "./utils/users.test.helpers";
import {UserViewModel} from "../src/users/types/UserViewModel";
import {LoginInputModel} from "../src/auth/types/LoginInputModel";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import {testDtosCreator} from "./utils/testDtosCreator";
import {ADMIN_LOGIN, ADMIN_PASS} from "../src/auth/guards/base.auth.guard";
import {ObjectId} from "mongodb";


describe('Users', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    beforeEach(async () => {
        await db.drop()
    })
    afterAll(async () => {
        await db.stop()
    })
    afterAll(done => {
        done()
    })

    it('POST and GET =/users= should create user, status 201, should return all created users, status 200', async () => {
        const dataToCreateUser = testDtosCreator.createUserDto({})
        const res = await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToCreateUser)
            .expect(HttpStatusCodes.Created_201)

        expect(res.body).toEqual({
            id: expect.any(String),
            login: dataToCreateUser.login,
            email: dataToCreateUser.email,
            createdAt: expect.any(String),
        })

        // GET
        const res1 = await request(app).get(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .expect(HttpStatusCodes.OK_200)
        expect(res1.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: expect.any(String),
                login: dataToCreateUser.login,
                email: dataToCreateUser.email,
                createdAt: expect.any(String),}]
        })
    })
    it('POST, DELETE, GET =/users= should return error if auth credentials is incorrect, status 401', async () => {
        const dataToCreateUser = testDtosCreator.createUserDto({})
        const createdUser = await usersTestManager.createUser()

        await request(app)
            .post(routerPaths.users)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(dataToCreateUser)
            .expect(HttpStatusCodes.Unauthorized_401)

        await request(app)
            .delete(`${routerPaths.users}/${createdUser.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .expect(HttpStatusCodes.Unauthorized_401)

        await request(app)
            .get(routerPaths.users)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .expect(HttpStatusCodes.Unauthorized_401)
    })
    it('POST =/auth= should return error if auth credentials is incorrect, status 401', async () => {
        const createdUser = await usersTestManager.createUser()
        const dataToLogin: LoginInputModel = {
            loginOrEmail: createdUser.login,
            password: 'qwrt'
        }
        await request(app).post(routerPaths.auth.login)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(dataToLogin)
            .expect(HttpStatusCodes.Unauthorized_401)

    })
    it('DELETE =/users/{id}= should not delete not existing user, status 404', async () => {
        const createdUser = await usersTestManager.createUser()
        const randomId = new ObjectId().toString()
        await request(app)
            .delete(`${routerPaths.users}/${randomId}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .expect(HttpStatusCodes.Not_Found_404)
    })
    it('POST =/users= should return validation error if body is incorrect, status 400', async () => {
        const badDataToCreateUser_loginMin = testDtosCreator.createUserDto({
            login: 'as'
        })
        const badDataToCreateUser_loginMax: UserInputModel = testDtosCreator.createUserDto({
            login: 'asasdfasfasfasfasfafasf'
        })
        const badDataToCreateUser_passwordMin = testDtosCreator.createUserDto({
            password: 'q'
        })
        const badDataToCreateUser_passwordMax = testDtosCreator.createUserDto({
            password: 'qwertyasfdafsasfasfasf'
        })
        const badDataToCreateUser_badEmail: UserInputModel = testDtosCreator.createUserDto({
            email: 'asdfkjhasdgkjlhmail.com'
        })

        await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(badDataToCreateUser_loginMin)
            .expect(HttpStatusCodes.Bad_Request_400)

        await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(badDataToCreateUser_loginMax)
            .expect(HttpStatusCodes.Bad_Request_400)

        await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(badDataToCreateUser_passwordMin)
            .expect(HttpStatusCodes.Bad_Request_400)

        await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(badDataToCreateUser_passwordMax)
            .expect(HttpStatusCodes.Bad_Request_400)

        await request(app).post(routerPaths.users)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .send(badDataToCreateUser_badEmail)
            .expect(HttpStatusCodes.Bad_Request_400)
    })
    it('POST =/auth= should sign in user, status 204', async () => {
        const createdUser = await usersTestManager.createUser()
        await request(app).post(routerPaths.auth.login)
            .send({
            loginOrEmail: createdUser.login,
            password: 'qwerty',
        })
            .expect(HttpStatusCodes.No_Content_204)
    });
    it('DELETE =/users/{id}= should delete user by id, status 204', async () => {
        const createdUser = await usersTestManager.createUser()
        await request(app).delete(`${routerPaths.users}/${createdUser.id}`)
            .auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
            .expect(HttpStatusCodes.No_Content_204)
    })
})