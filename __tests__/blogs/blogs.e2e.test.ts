import {BlogInputModel} from "../../src/models/blogs/BlogInputModel";
import {blogsTestManager} from "./blogs.test.helpers";
import {HTTPStatusCodesEnum, SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";
import {BlogViewModel} from "../../src/models/blogs/BlogViewModel";
import {ObjectId} from "mongodb";

const req = agent(app)

describe('/blogs', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })

    let createdEntity: BlogViewModel
    it('POST, should create a blog, status 201', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
        }
        // POST
        const {status, body} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(status).toBe(HTTPStatusCodesEnum.Created_201)
        expect(body).toEqual({
            id: expect.any(String),
            name: '1st blog',
            description: '1st description',
            webSiteUrl: 'http://localhost.1.ru',
            createdAt: expect.any(String),
            isMembership: false
        })

        createdEntity = body

        // GET
        const resBlogs = await blogsTestManager.getAllBlogs()
        expect(resBlogs.body.length).toEqual(1);
    })
    it('PUT, should update a blog, status 204', async () => {
        const dataToUpdateBlog: BlogInputModel = {
            name: '1st upd blog',
            description: '1st updated description',
            webSiteUrl: 'http://localhost.1.updated.ru',
        }

        // PUT
        const {status} = await blogsTestManager.updateBlog(dataToUpdateBlog, createdEntity.id)
        expect(status).toBe(HTTPStatusCodesEnum.No_Content_204)

        // GET by id
        const {status: status1, body} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(status1).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(body).toEqual({
            _id: expect.any(String),
            id: createdEntity.id,
            name:'1st upd blog',
            description: '1st updated description',
            webSiteUrl: 'http://localhost.1.updated.ru',
            createdAt: expect.any(String),
            isMembership: false
        })
    })
    it('DELETE, should delete a blog by id, status 204', async () => {
        const {status} = await blogsTestManager.deleteBlogById(createdEntity.id)
        expect(status).toEqual(HTTPStatusCodesEnum.No_Content_204)

        // GET
        const {status: status1, body} = await blogsTestManager.getBlogById(createdEntity.id)
        expect(status1).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('GET, should return created blog, status 200', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '2nd blog',
            description: '2nd description',
            webSiteUrl: 'http://localhost.2.ru',
        }
        const {status, body} = await blogsTestManager.createBlog(dataToCreateBlog)
        expect(status).toEqual(HTTPStatusCodesEnum.Created_201)

        // GET
        const {status: status1, body: body1} = await blogsTestManager.getBlogById(body.id)
        expect(status1).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(body1).toEqual({
            _id: expect.any(String),
            id: body.id,
            ...dataToCreateBlog,
            createdAt: expect.any(String),
            isMembership: false
        })
    })
    it('POST,PUT,DELETE should not create/update/delete a blog with auth error, status 401', async () => {
        const dataToCreateBlog: BlogInputModel = {
            name: '3rd blog',
            description: '3rd description',
            webSiteUrl: 'http://localhost.3.ru',
        }
        const dataToUpdateBlog = {
            name: '3rd upd blog',
            description: '3rd upd description',
            webSiteUrl: 'http://localhost.3.upd.ru',
        }
        // POST
        const{status} = await req.post(SETTINGS.PATH.BLOGS).set({'Authorization': 'Basic uasdi1h3123'}).send(dataToCreateBlog)
        expect(status).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        // PUT
            // POST with correct auth data
            const {status: status1, body: createdBlog} = await blogsTestManager.createBlog(dataToCreateBlog)
            createdEntity = createdBlog

        const {status: status2} = await req
            .put(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
            .send(dataToUpdateBlog)
        expect(status2).toEqual(HTTPStatusCodesEnum.Unauthorized_401)

        // DELETE by id
        const {status: status3} = await req
            .delete(`${SETTINGS.PATH.BLOGS}/${createdBlog.id}`)
            .set({'Authorization': 'Basic uasdi1h3123'})
        expect(status3).toEqual(HTTPStatusCodesEnum.Unauthorized_401)
    })
    it('POST, PUT should not create a blog with validation error, status 400', async () => {
        // Incorrect name
        const dataToCreateOrUpdateBlog: BlogInputModel = {
            name: '4th blogdddddddddddddddddddddd',
            description: '4th description',
            webSiteUrl: 'http://localhost.3.ru',
        }
        // POST
        const {status: createdStatus, body} = await blogsTestManager.createBlog(dataToCreateOrUpdateBlog)
        expect(createdStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        expect(body).toEqual(expect.any(Object)) // TODO Уточнить объект
        // PUT
        const {status:updatedStatus} = await blogsTestManager.updateBlog(dataToCreateOrUpdateBlog, body.id)
        expect(updatedStatus).toEqual(HTTPStatusCodesEnum.Bad_Request_400)


        // Incorrect description
        const descriptionString500: string = '4th description'.repeat(500)
        const dataToCreateOrUpdateBlog1: BlogInputModel = {
            name: '4th blog',
            description: descriptionString500,
            webSiteUrl: 'http://localhost.3.ru',
        }
        // POST
        const {status: createdStats1, body:body1} = await blogsTestManager.createBlog(dataToCreateOrUpdateBlog1)
        expect(createdStats1).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        expect(body1).toEqual(expect.any(Object)) // TODO Уточнить объект
        // PUT
        const {status:updatedStatus1} = await blogsTestManager.updateBlog(dataToCreateOrUpdateBlog1, body1.id)
        expect(updatedStatus1).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

        // Incorrect webSiteUrl
        const dataToCreateOrUpdateBlog2: BlogInputModel = {
            name: '4th blog',
            description: descriptionString500,
            webSiteUrl: 'http//localhost',
        }
        // POST
        const {status: createdStatus2, body:body2} = await blogsTestManager.createBlog(dataToCreateOrUpdateBlog2)
        expect(createdStatus2).toEqual(HTTPStatusCodesEnum.Bad_Request_400)
        expect(body2).toEqual(expect.any(Object)) // TODO Уточнить объект
        // PUT
        const {status:updatedStatus2} = await blogsTestManager.updateBlog(dataToCreateOrUpdateBlog2, body2.id)
        expect(updatedStatus2).toEqual(HTTPStatusCodesEnum.Bad_Request_400)

    })
    it('PUT, DELETE, GET, should return error if id was not found; status 404', async () => {
        const dataToUpdateBlog: BlogInputModel = {
            name: '4th blogdddd',
            description: '4th description',
            webSiteUrl: 'http://localhost.3.ru',
        }
        // PUT
        const {status} = await blogsTestManager.updateBlog(dataToUpdateBlog, 'kjadfghlkjahfg')
        expect(status).toEqual(HTTPStatusCodesEnum.Not_Found_404)

        // DELETE
        const {status: status1} = await blogsTestManager.deleteBlogById('fdgjhnerkjlng')
        expect(status1).toEqual(HTTPStatusCodesEnum.Not_Found_404)

        // GET
        const {status: status2} = await blogsTestManager.getBlogById('sdfgsnbrthtyrhkm')
        expect(status2).toEqual(HTTPStatusCodesEnum.Not_Found_404)
    })
    it('GET, should return all blogs in DB, status 200 ', async () => {
        const {status, body:allBlogs} = await blogsTestManager.getAllBlogs()
        expect(status).toEqual(HTTPStatusCodesEnum.OK_200)
        expect(allBlogs).toEqual(expect.any(Array))
    });
})