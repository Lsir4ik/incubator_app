import {req, videosTestManager} from "./test-helpers";
import {HTTPStatusCodesEnum, Resolutions, SETTINGS} from "../src/settings";
import {CreateVideoInputModel} from "../src/models/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../src/models/UpdateVideoInputModel";

describe('/videos', () => {

    it('DELETE - "/testing/all-data" - should remove all data, status 204', async () => {
        await req
            .delete(SETTINGS.PATH.TESTING)
            .expect(HTTPStatusCodesEnum.No_Content_204)
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTPStatusCodesEnum.OK_200)

        expect(res.body.length).toBe(0)
    })

    it('POST - "/videos", should create new video, status 201, content: created video', async () => {
        const newEntityData: CreateVideoInputModel = {
            title: "1st video",
            author: "Banana",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }
        const createdEntity = await videosTestManager.createVideo(newEntityData)

        expect(createdEntity.body.title).toEqual(newEntityData.title)
        expect(createdEntity.body.author).toEqual(newEntityData.author)
        expect(createdEntity.body.availableResolutions).toEqual(newEntityData.availableResolutions)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTPStatusCodesEnum.OK_200)

        expect(res.body.length).toBe(1)
    })

    it('PUT - "/videos/:id", should update video by id, status 204', async () => {
        // Data for create video
        const newEntityData: CreateVideoInputModel = {
            title: "2nd video",
            author: "Pomodoro",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }

        // Data for update video by id
        const dataForUpdateEntity: UpdateVideoInputModel = {
            title: "2nd video updated",
            author: "Pomodoro updated",
            availableResolutions: [Resolutions.P144, Resolutions.P480],
            canBeDownloaded: true,
            publicationDate: new Date().toISOString()
        }

        // Create video
        const createdEntity = await videosTestManager.createVideo(newEntityData)
        // Update video by id
        const updatedEntity = await videosTestManager.updateVideo(dataForUpdateEntity, createdEntity.body.id)

        // Get video by id
        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/' + createdEntity.body.id)
            .expect(HTTPStatusCodesEnum.OK_200)

        expect(res.body.id).toEqual(createdEntity.body.id)

        // Get all videos (2)
        const res1 = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(HTTPStatusCodesEnum.OK_200)

        expect(res1.body.length).toBe(2)
    })

    it('GET - "/videos", should return array of videos, status 200, content: array of videos', async () => {})

    it('GET - "/videos/:id", should return a video by id, status 200, content: video', async () => {})

    it('DELETE - "/videos/:id", should delete a video by id, status 204', async () => {})

    it('PUT, DELETE, GET - "/videos/:id", should return error if id not found, status 404', async () => {})

    it('POST - "/videos", should return error if passed body incorrect, status 400', async () => {})

    it('PUT - "/videos/:id", should return error if passed body incorrect, status 400', async () => {})

})