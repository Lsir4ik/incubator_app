import {app} from '../src/app'
import {agent} from 'supertest'
import {CreateVideoInputModel} from "../src/models/CreateVideoInputModel";
import {HTTPStatusCodesEnum, SETTINGS} from "../src/settings";
import {UpdateVideoInputModel} from "../src/models/UpdateVideoInputModel";

export const req = agent(app)

export const videosTestManager = {
    async createVideo(data: CreateVideoInputModel, expectedStatusCode: HTTPStatusCodesEnum = HTTPStatusCodesEnum.Created_201) {
        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(data)
            .expect(expectedStatusCode)

        return res;
    },
    async updateVideo(data: UpdateVideoInputModel, id: string, expectedStatusCode: HTTPStatusCodesEnum = HTTPStatusCodesEnum.No_Content_204) {
        const res = await req
            .put(SETTINGS.PATH.VIDEOS + "/" + id)
            .send(data)
            .expect(expectedStatusCode)
    }
}