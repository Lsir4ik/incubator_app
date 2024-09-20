import {agent} from "supertest";
import {app} from "../src/app";
import {HTTPStatusCodesEnum, SETTINGS} from "../src/settings";

const req = agent(app)

describe('/testing/all-data', () => {
    it('DELETE, should remove all data, status 204', async () => {
        await req.delete(SETTINGS.PATH.TESTING)
            .expect(HTTPStatusCodesEnum.No_Content_204)

        const resBlogs = await req.get(SETTINGS.PATH.BLOGS).expect(HTTPStatusCodesEnum.OK_200)
        expect(resBlogs.body).toEqual(0);

        const resPosts = await req.get(SETTINGS.PATH.POSTS).expect(HTTPStatusCodesEnum.OK_200)
        expect(resPosts.body).toEqual(0);
    })
})