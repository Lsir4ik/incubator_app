import {agent} from "supertest";
import {app} from "../../src/app";
import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {LoginInputModel} from "../../src/models/login/LoginInputModel";

const req = agent(app)

describe('auth', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })

    it('POST =/auth= should return error if auth credentials is incorrect, status 401', async () => {
        const dataToLogin: LoginInputModel = {
            loginOrEmail: '1stuser',
            password: 'qwrt'
        }
        const {status: loginStatus} = await req.post(`${SETTINGS.PATH.AUTH}/login`).send(dataToLogin)
        expect(loginStatus).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

    })
    it('POST =/auth= should sign in user, status 204', async () => {
        const {status: successSignInStatus} = await req.post(`${SETTINGS.PATH.AUTH}/login`).send({
            loginOrEmail: '1stuser',
            password: 'qwerty',
        })
        expect(successSignInStatus).toEqual(HTTPStatusCodesEnum.No_Content_204)
    })
    it('GET =/auth/me= should return info about me, status 200', async () => {

    })
})