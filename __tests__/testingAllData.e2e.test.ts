import {agent} from "supertest";
import {app} from "../src/app";
import {blogsTestManager} from "./blogs/blogs.test.helpers";
import {postsTestManager} from "./posts/posts.test.helpers";
import {routerPaths} from "../src/common/path/path";
import {HttpStatusCodes} from "../src/common/types/httpsStatusCodes";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../src/db";
import {usersTestManager} from "./users/users.test.helpers";

const req = agent(app)

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
        await req
            .delete(routerPaths.testing)
            .expect(HttpStatusCodes.No_Content_204)

        const resBlogs = await blogsTestManager.getAllBlogs()
        expect(resBlogs.body.items.length).toEqual(0);

        const resPosts = await postsTestManager.getAllPosts()
        expect(resPosts.body.items.length).toEqual(0);

        const resUsers = await usersTestManager.getAllUsers()
        expect(resBlogs.body.items.length).toEqual(0);
    })
})