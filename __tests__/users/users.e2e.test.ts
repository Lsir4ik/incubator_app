import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";
import {UserInputModel} from "../../src/models/users/UserInputModel";
import {usersTestManager} from "./users.test.helpers";
import {UserViewModel} from "../../src/models/users/UserViewModel";
import {users} from "../../src/middlewares/authorization.middleware";
import {LoginInputModel} from "../../src/models/login/LoginInputModel";
import {LoginSuccessViewModel} from "../../src/models/login/LoginSuccessViewModel";

const req = agent(app)

describe('Users and Auth', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })
    let createdEntity: UserViewModel
    // USERS
    it('+POST =/users= should create user, status 201, should return all created users, status 200', async () => {
        const dataToCreateUser: UserInputModel = {
            login: '1stuser',
            password: 'qwerty',
            email: 'st@test.com',
        }
        const {status: createUserStatus, body: newUser} = await usersTestManager.createUser(dataToCreateUser)
        expect(createUserStatus).toEqual(HTTPStatusCodesEnum.Created_201)
        expect(newUser).toEqual({
            id: expect.any(String),
            login: dataToCreateUser.login,
            email: dataToCreateUser.email,
            createdAt: expect.any(String),
        })

        // GET
        const {status: getAllUserStatus, body: allUsers} = await usersTestManager.getAllUsers()
        expect(getAllUserStatus).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(allUsers).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: expect.any(String),
                login: '1stuser',
                email: 'st@test.com',
                createdAt: expect.any(String),}]
        })

        createdEntity = newUser

    })
    it('-POST =/users= should return validation error if body is incorrect, status 400', async () => {
        const badDataToCreateUser_loginMin: UserInputModel = {
            login: 'as',
            password: 'qwerty',
            email: 'asdfkjhasdgkjlh@mail.com'
        }
        const {status: loginMinCreateUserStatus} = await usersTestManager.createUser(badDataToCreateUser_loginMin)
        expect(loginMinCreateUserStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        const badDataToCreateUser_loginMax: UserInputModel = {
            login: 'asasdfasfasfasfasfafasf',
            password: 'qwerty',
            email: 'asdfkjhasdgkjlh@mail.com'
        }
        const {status: loginMaxCreateUserStatus} = await usersTestManager.createUser(badDataToCreateUser_loginMax)
        expect(loginMaxCreateUserStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        const badDataToCreateUser_passwordMin: UserInputModel = {
            login: 'someLogin',
            password: 'q',
            email: 'asdfkjhasdgkjlh@mail.com'
        }
        const {status: passwordMinCreateUserStatus} = await usersTestManager.createUser(badDataToCreateUser_passwordMin)
        expect(passwordMinCreateUserStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        const badDataToCreateUser_passwordMax: UserInputModel = {
            login: 'someLogin',
            password: 'qwertyasfdafsasfasfasf',
            email: 'asdfkjhasdgkjlh@mail.com'
        }
        const {status: passwordMaxCreateUserStatus} = await usersTestManager.createUser(badDataToCreateUser_passwordMax)
        expect(passwordMaxCreateUserStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        const badDataToCreateUser_badEmail: UserInputModel = {
            login: 'someLogin',
            password: 'qwerty',
            email: 'asdfkjhasdgkjlhmail.com'
        }
        const {status: badEmailCreateUserStatus} = await usersTestManager.createUser(badDataToCreateUser_badEmail)
        expect(badEmailCreateUserStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

    })
    it('-POST, DELETE, GET =/users= should return error if auth credentials is incorrect, status 401', async () => {
        const dataToCreateUser: UserInputModel = {
            login: '2nduser',
            password: 'qwerty',
            email: '2nd@test.com',
        }
        const {status: createUserStatus} = await req.post(SETTINGS.PATH.USERS).set({'Authorization': 'Basic uasdi1h3123'}).send(dataToCreateUser)
        expect(createUserStatus).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        const {status: deleteUserStatus} = await req.delete(`${SETTINGS.PATH.USERS}/${createdEntity.id}`).set({'Authorization': 'Basic uasdi1h3123'})
        expect(deleteUserStatus).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        const {status: getUserStatus} = await req.get(SETTINGS.PATH.USERS).set({'Authorization': 'Basic uasdi1h3123'})
        expect(getUserStatus).toEqual(HTTPStatusCodesEnum.Unauthorized_401)
    })
    it('+DELETE =/users/{id}= should delete user by id, status 204', async () => {

        // ---!!!--- Удаляем CreatedEntity!!!
        const {status: deleteUserStatus} = await usersTestManager.deleteUserById(createdEntity.id)
        expect(deleteUserStatus).toEqual(HTTPStatusCodesEnum.No_Content_204)
    })
    it('-DELETE =/users/{id}= should not delete not existing user, status 404', async () => {
        const {status: deleteUserStatus} = await usersTestManager.deleteUserById('asdfkjhasdgkjlh')
        expect(deleteUserStatus).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('-POST =/users= should not add existing user with existing email or login, ', async () => {
        // POST
        const dataToCreateUser: UserInputModel = {
            login: 'userForTestUnique',
            password: 'qwerty',
            email: 'userForTestUnique@mail.com'
        }
        await usersTestManager.createUser(dataToCreateUser)

        // POST same user with login
        const dataToCreateUserWithBadLogin: UserInputModel = {
            login: 'userForTestUnique',
            password: 'qwerty',
            email: 'some@mail.com'
        }
        const resLogin = await usersTestManager.createUser(dataToCreateUserWithBadLogin)
        expect(resLogin.status).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        // POST same user with login
        const dataToCreateUserWithBadEmail: UserInputModel = {
            login: 'someUser',
            password: 'qwerty',
            email: 'userForTestUnique@mail.com'
        }
        const resEmail = await usersTestManager.createUser(dataToCreateUserWithBadLogin)
        expect(resEmail.status).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
    })
    it('+GET =/users= should return all users with default pagination, status 200', async () => {
        // Clear data
        await req.delete(SETTINGS.PATH.TESTING)

        // POST create 3 users
        const user1:UserInputModel = {
            login: 'user1',
            password: 'qwerty',
            email: 'user1@mail.com'
        }
        const user2:UserInputModel = {
            login: 'user2',
            password: 'qwerty',
            email: 'user2@mail.com'
        }
        const user3:UserInputModel = {
            login: 'user3',
            password: 'qwerty',
            email: 'user3@mail.com'
        }
        await usersTestManager.createUser(user1)
        await usersTestManager.createUser(user2)
        await usersTestManager.createUser(user3)

        // GET with pagination
        const res = await usersTestManager.getAllUsers()
        expect(res.status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(res.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 3,
            items: [
                {
                    id: expect.any(String),
                    login: 'user3',
                    email: 'user3@mail.com',
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    login: 'user2',
                    email: 'user2@mail.com',
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    login: 'user1',
                    email: 'user1@mail.com',
                    createdAt: expect.any(String),
                }
            ]
        })
    })
    it('+GET =/users= should return all users with pagination input query data, status 200', async () => {

        // Clear data
        await req.delete(SETTINGS.PATH.TESTING)

        // POST create 3 users
        const user1:UserInputModel = {
            login: 'user1',
            password: 'qwerty',
            email: 'user1@mail.com'
        }
        const user2:UserInputModel = {
            login: 'user2',
            password: 'qwerty',
            email: 'user2@mail.com'
        }
        const user3:UserInputModel = {
            login: 'user3',
            password: 'qwerty',
            email: 'user3@mail.com'
        }
        await usersTestManager.createUser(user1)
        await usersTestManager.createUser(user2)
        await usersTestManager.createUser(user3)

        // Auth data
        let data = `${users[0].login}:${users[0].password}`
        let buff = Buffer.from(data)
        let codeAuth = buff.toString('base64')

        // GET with pagination
        const res = await req.get(SETTINGS.PATH.USERS).set({'Authorization': 'Basic ' + codeAuth}).query({pageSize: 2})
        expect(res.status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(res.body).toEqual({
            pagesCount: 2,
            page: 1,
            pageSize: 2,
            totalCount: 3,
            items: [
                {
                    id: expect.any(String),
                    login: 'user3',
                    email: 'user3@mail.com',
                    createdAt: expect.any(String),
                },
                {
                    id: expect.any(String),
                    login: 'user2',
                    email: 'user2@mail.com',
                    createdAt: expect.any(String),
                }
            ]
        })
    })

    // AUTH
    let token: LoginSuccessViewModel
    it('-POST =/auth/login= should return error if auth credentials is incorrect, status 401', async () => {
        const dataToLogin: LoginInputModel = {
            loginOrEmail: '1stuser',
            password: 'qwrt'
        }
        const {status: loginStatus} = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(dataToLogin)
        expect(loginStatus).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

    })
    it('+POST =/auth= should sign in user, status 204', async () => {
        // Create user
        const dataToCreateUser: UserInputModel = {
            login: 'authuser',
            password: 'qwerty',
            email: 'authuser@test.com',
        }
        const {status: createUserStatus, body: newUser} = await usersTestManager.createUser(dataToCreateUser)
        expect(createUserStatus).toEqual(HTTPStatusCodesEnum.Created_201)
        const {status: successSignInStatus, body} = await req.post(`${SETTINGS.PATH.AUTH}/login`).send({
            loginOrEmail: 'authuser',
            password: 'qwerty',
        })
        expect(successSignInStatus).toEqual(HTTPStatusCodesEnum.OK_200)
        token = body
    })
    it('GET =/auth/me= should return info about me, status 200', async () => {
        const res = await req.get(`${SETTINGS.PATH.AUTH}/me`)
            .set({'Authorization': 'Bearer ' + token.accessToken})
        expect(res.status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(res.body).toEqual({
            email: 'authuser@test.com',
            login: 'authuser',
            userId: expect.any(String),
        })
    })
})