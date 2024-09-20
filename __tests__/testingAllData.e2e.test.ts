import {agent} from "supertest";
import {app} from "../src/app";
import {request} from "node:http";
import {HTTPStatusCodesEnum, SETTINGS} from "../src/settings";

const req = agent(app)

describe('/testing/all-data', () => {
    it('DELETE, should remove all data, status 204', async () => {
        await req.delete(SETTINGS.PATH.TESTING)
            .expect(HTTPStatusCodesEnum.No_Content_204)
        await req.get(SETTINGS.PATH.BLOGS).
    })
})