import {app} from '../src/app'
import {agent} from 'supertest'
import {CreateVideoInputModel} from "../src/models/video/CreateVideoInputModel";
import {HTTPStatusCodesEnum, SETTINGS} from "../src/settings";
import {UpdateVideoInputModel} from "../src/models/video/UpdateVideoInputModel";

export const req = agent(app)

export const videosTestManager = {
    async createVideo(data: CreateVideoInputModel, expectedStatusCode: HTTPStatusCodesEnum = HTTPStatusCodesEnum.Created_201) {
        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;

        if (expectedStatusCode === HTTPStatusCodesEnum.Created_201) {
            createdEntity = res.body
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: data.title,
                author: data.author,
                canBeDownloaded: expect.any(Boolean),
                minAgeRestriction: expect.any(Object),
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: data.availableResolutions
            })
        }

        return {res, createdEntity};
    },
    async updateVideo(data: UpdateVideoInputModel, id: string, expectedStatusCode: HTTPStatusCodesEnum = HTTPStatusCodesEnum.No_Content_204) {
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + "/" + id)
            .send(data)
            .expect(expectedStatusCode)
        return res
    },
    async getAllVideos(expectedCountOfVideos: number, expectedStatusCode: HTTPStatusCodesEnum = HTTPStatusCodesEnum.OK_200){
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(expectedStatusCode)
        expect(res.body.length).toBe(expectedCountOfVideos)
    }
}