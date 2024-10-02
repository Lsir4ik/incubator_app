import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";
import {UserInputModel} from "../../src/models/users/UserInputModel";
import {usersTestManager} from "./users.test.helpers";
import {UserViewModel} from "../../src/models/users/UserViewModel";
import {LoginInputModel} from "../../src/models/login/LoginInputModel";

const req = agent(app)

describe('Users', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })
    let createdEntity: UserViewModel
    it('POST and GET =/users= should create user, status 201, should return all created users, status 200', async () => {
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
    it('POST, DELETE, GET =/users= should return error if auth credentials is incorrect, status 401', async () => {
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
    it('POST =/auth= should return error if auth credentials is incorrect, status 401', async () => {
        const dataToLogin: LoginInputModel = {
            loginOrEmail: '1stuser',
            password: 'qwrt'
        }
        const {status: loginStatus} = await req.post(SETTINGS.PATH.AUTH).send(dataToLogin)
        expect(loginStatus).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

    })
    it('DELETE =/users/{id}= should not delete not existing user, status 404', async () => {
        const {status: deleteUserStatus} = await usersTestManager.deleteUserById('asdfkjhasdgkjlh')
        expect(deleteUserStatus).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('POST =/users= should return validation error if body is incorrect, status 400', async () => {
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
    it('POST =/auth= should sign in user, status 204', async () => {
        const {status: successSignInStatus} = await req.post(SETTINGS.PATH.AUTH).send({
            loginOrEmail: '1stuser',
            password: 'qwerty',
        })
        expect(successSignInStatus).toEqual(HTTPStatusCodesEnum.No_Content_204)
    });
    it('DELETE =/users/{id}= should delete user by id, status 204', async () => {

        // ---!!!--- Удаляем CreatedEntity!!!
        const {status: deleteUserStatus} = await usersTestManager.deleteUserById(createdEntity.id)
        expect(deleteUserStatus).toEqual(HTTPStatusCodesEnum.No_Content_204)
    })
})