import {agent} from "supertest";
import {app} from "../src/app";
import {HTTPStatusCodesEnum, SETTINGS} from "../src/settings";
import {blogsTestManager} from "./blogs/blogs.test.helpers";
import {postsTestManager} from "./posts/posts.test.helpers";

const req = agent(app)

describe('/testing/all-data', () => {
    it('DELETE, should remove all data, status 204', async () => {
        await req
            .delete(SETTINGS.PATH.TESTING)
            .expect(HTTPStatusCodesEnum.No_Content_204)

        const resBlogs = await blogsTestManager.getAllBlogs()
        expect(resBlogs.body.items.length).toEqual(0);

        const resPosts = await postsTestManager.getAllPosts()
        expect(resPosts.body.items.length).toEqual(0);
    })
})