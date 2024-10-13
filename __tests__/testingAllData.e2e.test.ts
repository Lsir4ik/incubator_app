import request from "supertest";
import {app} from "../src/app";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import {ADMIN_LOGIN, ADMIN_PASS} from "../src/auth/guards/base.auth.guard";


describe('/testing/all-data', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    afterAll(async () => {
        await db.stop()
    })
    afterAll(done  => {
        done()
    })

    it('DELETE, should remove all data, status 204', async () => {
        await request(app)
            .delete(routerPaths.testing)
            .expect(HttpStatusCodes.No_Content_204)

        const resBlogs = await request(app).get(routerPaths.blogs)
        expect(resBlogs.body.items.length).toEqual(0);

        const resPosts = await request(app).get(routerPaths.posts)
        expect(resPosts.body.items.length).toEqual(0);

        const resUsers = await request(app).get(routerPaths.users).auth(ADMIN_LOGIN, ADMIN_PASS, {type: 'basic'})
        expect(resUsers.body.items.length).toEqual(0);
    })
})