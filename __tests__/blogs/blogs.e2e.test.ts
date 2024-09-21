import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {BlogViewModel} from "../../src/models/blogs/BlogViewModel";
import {blogsTestManager} from "./blogs.test.helpers";
import {HTTPStatusCodesEnum} from "../../src/settings";
import any = jasmine.any;

describe('/blogs', () => {
    let createdEntity: BlogViewModel | null = null
    it('POST, should create a blog, status 201, content: create blog', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost:8080',
        }
        const {status, body} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(body).toEqual({
            id: any(String),
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost:8080',
        })
        expect(status).toEqual(HTTPStatusCodesEnum.Created_201)

        // GET
    })
    it('GET, should create a blog, status 201, content: create blog', async () => {})

})