import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import request from "supertest";
import {app} from "../src/app";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {emailManager} from "../src/common/managers/email.manager";
import {ADMIN_LOGIN, ADMIN_PASS} from "../src/auth/guards/base.auth.guard";
import {usersTestManager} from "./utils/users.test.helpers";
import {LoginInputModel} from "../src/auth/types/LoginInputModel";
import {Result} from "../src/common/types/result.type";
import {usersRepository} from "../src/users/users.repository";


describe('AUTH', () => {
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

    emailManager.sendRegistrationConfirmationEmail = jest.fn().mockImplementation((email: string, code: string) => Promise<Result<true>>)

    it('-POST =/auth/login= should return error if auth credentials is incorrect, status 401', async () => {
        const createdUser = await usersTestManager.createUser()
        const dataToLogin: LoginInputModel = {
            loginOrEmail: createdUser.login,
            password: 'qwt'
        }
        await request(app).post(routerPaths.auth.login)
            .send(dataToLogin)
            .expect(HttpStatusCodes.Unauthorized_401)

    })
    it('+POST =/auth/login= should sign in user, status 204', async () => {
        const createdUser = await usersTestManager.createUser()
        await request(app).post(routerPaths.auth.login)
            .send({
                loginOrEmail: createdUser.login,
                password: 'qwerty',
            })
            .expect(HttpStatusCodes.OK_200)
    });
    it('+POST =/auth/registration=, should register user, status 204',async () => {
            const userDto = {
                login: "sybject1",
                email: "islazarevn@gmail.com",
                password: "111ewr"
            }
            await request(app).post(routerPaths.auth.registration).send(userDto).expect(HttpStatusCodes.No_Content_204)
            expect(emailManager.sendRegistrationConfirmationEmail).toBeCalled()
            expect(emailManager.sendRegistrationConfirmationEmail).toBeCalledTimes(1)

            const res = await request(app).get(routerPaths.users).auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'}).expect(HttpStatusCodes.OK_200)
            expect(res.body).toEqual(
            {
                pagesCount: 1,
                    page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{
                    id: expect.any(String),
                    login: userDto.login,
                    email: userDto.email,
                    createdAt: expect.any(String),}]
            })
        })
    it('+POST =/auth/registration-confirmation=, should confirm users email, status 204', async () => {
        // Register user
        const userDto = {
            login: "sybject1",
            email: "islazarevn@gmail.com",
            password: "111ewr"
        }
        await request(app).post(routerPaths.auth.registration).send(userDto).expect(HttpStatusCodes.No_Content_204)
        // Confirm user
        const createdUserDB = await usersRepository.findUserByLoginOrEmail(userDto.login)
        const confirmationCode = createdUserDB!.emailConfirmation.confirmationCode

        await request(app)
            .post(routerPaths.auth.registrationConfirmation)
            .send({code:confirmationCode})
            .expect(HttpStatusCodes.No_Content_204)
    });
    it('+POST, =auth/registration-email-resending= should resend confirmation email, status 204', async () => {
        // TODO доделать тесты, в т.ч. ниже
    });
    it('-POST, should not register user with validation error, status 400', async () => {

    });
    it('-POST, should return error if email or login already exist, status 400', async () => {

    });
    it('POST =auth/registration-confirmation=: should return error if code already confirmed, status 400', async () => {

    });
    it('POST =auth/registration-email-resending=, should return error if email already confirmed, status 400', async () => {
        
    });
    it('POST =auth/registration-confirmation=, should return error if code doesnt exist, status 400', async () => {
        
    });
    it('POST =auth/registration-email-resending=, should return error if user email doesnt exist, status 400', async () => {

    });
})