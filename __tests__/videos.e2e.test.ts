import {req, videosTestManager} from "./video-test-helpers";
import {HTTPStatusCodesEnum, Resolutions, SETTINGS} from "../src/settings";
import {CreateVideoInputModel} from "../src/models/video/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../src/models/video/UpdateVideoInputModel";

describe('/videos', () => {

    it('DELETE - "/testing/all-data" - should remove all data, status 204', async () => {
        await req
            .delete(SETTINGS.PATH.TESTING)
            .expect(HTTPStatusCodesEnum.No_Content_204)

        await videosTestManager.getAllVideos(0)
    })

    it('POST - "/videos", should create new video, status 201, content: created video', async () => {
        // Data for create first video
        const newEntityData: CreateVideoInputModel = {
            title: "1st video",
            author: "Banana",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }
        // POST
        const {createdEntity} = await videosTestManager.createVideo(newEntityData)
        // GET All
        await videosTestManager.getAllVideos(1) // TODO exprect вынести в тест
    })

    it('PUT - "/videos/:id", should update video by id, status 204', async () => {
        // Data for create second video
        const newEntityData: CreateVideoInputModel = {
            title: "2nd video",
            author: "Pomodoro",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }

         // Data for update video by id
       const dataForUpdateEntity: UpdateVideoInputModel = {
            title: "2nd video updated",
            author: "Pomodoro updated",
            availableResolutions: [Resolutions.P144, Resolutions.P1080],
            canBeDownloaded: true,
        }

        // Create video
        const {createdEntity} = await videosTestManager.createVideo(newEntityData)
        // Update video by id
        const updatedEntity = await videosTestManager.updateVideo(dataForUpdateEntity, createdEntity.id)

        // Get video by id
        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${createdEntity.id}`)
            .expect(HTTPStatusCodesEnum.OK_200)

        expect(res.body.id).toEqual(createdEntity.id)

        // Get all videos (2)
        await videosTestManager.getAllVideos(2)

    })

    it('GET - "/videos", should return array of videos, status 200, content: array of videos', async () => {
        // Data for create third video
        const newEntityData: CreateVideoInputModel = {
            title: "3nd video",
            author: "Cucumber",
            availableResolutions: [Resolutions.P480]
        }
        // Create video
        await videosTestManager.createVideo(newEntityData)
        // Get all videos (expected count = 3)
        await videosTestManager.getAllVideos(3)
    })

    it('GET - "/videos/:id", should return a video by id, status 200, content: video', async () => {
        // Data for create fourth video
        const newEntityData: CreateVideoInputModel = {
            title: "4th video",
            author: "Eggs",
            availableResolutions: [Resolutions.P480]
        }
        // Create video
        const {createdEntity} = await videosTestManager.createVideo(newEntityData)
        // Get video by id
        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${createdEntity.id}`)
            .expect(HTTPStatusCodesEnum.OK_200)

        expect(res.body.id).toEqual(createdEntity.id)
    })

    it('DELETE - "/videos/:id", should delete a video by id, status 204', async () => {
            // Data for create fifth video
            const newEntityData: CreateVideoInputModel = {
                title: "5th video",
                author: "Bread",
                availableResolutions: [Resolutions.P720]
            }
            // Create video
            const {createdEntity} = await videosTestManager.createVideo(newEntityData)

            // Delete video by id
            await req.delete(`${SETTINGS.PATH.VIDEOS}/${createdEntity.id}`)
                .expect(HTTPStatusCodesEnum.No_Content_204)

            // Get video by id (404 NOT FOUND)
            const res = await req
                .get(`${SETTINGS.PATH.VIDEOS}/${createdEntity.id}`)
                .expect(HTTPStatusCodesEnum.Not_Found_404)
        })

    it('PUT, DELETE, GET - "/videos/:id", should return error if id not found, status 404', async () => {
        // Generate uniq ID
        const uriID = new Date().toISOString()

        // Data for update video by id
        const dataForUpdateEntity: UpdateVideoInputModel = {
            title: "2nd video updated",
            author: "Pomodoro updated",
            availableResolutions: [Resolutions.P144, Resolutions.P1080],
            canBeDownloaded: true,
        }
        // Delete video by id
        await req.delete(`${SETTINGS.PATH.VIDEOS}/${uriID}`)
            .expect(HTTPStatusCodesEnum.Not_Found_404)
        // Get video by id
        const res = await req
            .get(`${SETTINGS.PATH.VIDEOS}/${uriID}`)
            .expect(HTTPStatusCodesEnum.Not_Found_404)
        // Update video by id
        const updatedEntity = await videosTestManager.updateVideo(dataForUpdateEntity, uriID, HTTPStatusCodesEnum.Not_Found_404)
    })

    it('POST - "/videos", should return error if passed body incorrect, status 400', async () => {
        // Bad data for create first video (no title)
        const newEntityBadData2: CreateVideoInputModel = {
            title: "",
            author: "",
            availableResolutions: []
        }
        // POST
        const {res: res1} = await videosTestManager.createVideo(newEntityBadData2, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res1.body.errorMessages[0]).toEqual({
            message: "Title is required",
            field: "title"
        })

        // Bad data for create first video (max length of title)
        const newEntityBadData1: CreateVideoInputModel = {
            title: "1234567890 + 1234567890 + 1234567890 + 1234567890 + 1234567890",
            author: "1234567890 + 1234567890 + 1234567890",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }
        // POST
        const {res: res2} = await videosTestManager.createVideo(newEntityBadData1, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res2.body.errorMessages[0]).toEqual({
            message: "Title length should be less than 40 characters",
            field: "title"
        })

        // Bad data for create first video (no author)
        const newEntityBadData3: CreateVideoInputModel = {
            title: "1234567890 + 1234567890",
            author: "",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }
        // POST
        const {res: res3} = await videosTestManager.createVideo(newEntityBadData3, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res3.body.errorMessages[0]).toEqual({
            message: "Author is required",
            field: "author"
        })

        // Bad data for create first video (max length of  author)
        const newEntityBadData4: CreateVideoInputModel = {
            title: "1234567890 ",
            author: "1234567890 + 1234567890 + 1234567890 + 1234567890 + 1234567890",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }
        // POST
        const {res: res4} = await videosTestManager.createVideo(newEntityBadData4, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res4.body.errorMessages[0]).toEqual({
            message: "Author length should be less than 20 characters",
            field: "author"
        })

        // BAD POST for Resolution // TODO Ошибка в обработке данных для создания видео на уровне роутера
    })

    it('PUT - "/videos/:id", should return error if passed body incorrect, status 400', async () => {
        // Data for create sixth video
        const newEntityData: CreateVideoInputModel = {
            title: "6th video",
            author: "Carrot",
            availableResolutions: [Resolutions.P144, Resolutions.P480]
        }
        // POST
        const {createdEntity} = await videosTestManager.createVideo(newEntityData)

        /*-------------------*/

        // Bad data for update first video (no title)
        const newEntityBadData2: UpdateVideoInputModel= {
            title: "",
            author: "",
        }
        // PUT
        const res = await videosTestManager.updateVideo(newEntityBadData2, createdEntity.id, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res.body.errorMessages[0]).toEqual({
            message: "Title is required",
            field: "title"
        })

        // Bad data for create first video (max length of title)
        const newEntityBadData1: UpdateVideoInputModel = {
            title: "1234567890 + 1234567890 + 1234567890 + 1234567890 + 1234567890",
            author: "1234567890 + 1234567890 + 1234567890",
        }
        // PUT
        const res1 = await videosTestManager.updateVideo(newEntityBadData1, createdEntity.id, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res1.body.errorMessages[0]).toEqual({
            message: "Title length should be less than 40 characters",
            field: "title"
        })

        // Bad data for create first video (no author)
        const newEntityBadData3: UpdateVideoInputModel = {
            title: "1234567890 + 1234567890",
            author: "",
        }
        // PUT
        const res2 = await videosTestManager.updateVideo(newEntityBadData3, createdEntity.id, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res2.body.errorMessages[0]).toEqual({
            message: "Author is required",
            field: "author"
        })

        // Bad data for create first video (max length of  author)
        const newEntityBadData4: UpdateVideoInputModel = {
            title: "1234567890 ",
            author: "1234567890 + 1234567890 + 1234567890 + 1234567890 + 1234567890",
        }
        // PUT
        const res3 = await videosTestManager.updateVideo(newEntityBadData4, createdEntity.id, HTTPStatusCodesEnum.Bad_Request_400)
        expect(res3.body.errorMessages[0]).toEqual({
            message: "Author length should be less than 20 characters",
            field: "author"
        })




    })

})