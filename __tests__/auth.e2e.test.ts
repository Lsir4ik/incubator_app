import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import request from "supertest";
import {app} from "../src/app";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {emailManager} from "../src/common/managers/email.manager";
import {ADMIN_LOGIN, ADMIN_PASS} from "../src/auth/guards/base.auth.guard";


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

    emailManager.sendRegistrationConfirmationEmail = jest.fn().mockImplementation((email: string, code: string) => true)

    it('+POST, should register user, status 204',async () => {
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
    it('+POST, should confirm users email, status 204 ', async () => {

    });
    it('+POST, should resend confirmation email, status 204 ', async () => {

    });
    it('-POST, should not register user with validation error, status 400 ', async () => {

    });
    it('should ', async () => {

    });
    it('should ', async () => {

    });

})