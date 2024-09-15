import {Router, Request, Response} from "express";
import {videosLocalRepository} from "../repositories/Local/videos-in-memory-repository";
import {HTTPStatusCodesEnum} from "../settings";
import {createVideoValidation, updateVideoValidation} from "../middlewares/video-validation-middleware";
import {APIErrorResult} from "../models/ErrorModels";
import {VideoViewModel} from "../models/video/VideoViewModel";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types";
import {CreateVideoInputModel} from "../models/video/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../models/video/UpdateVideoInputModel";

export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response<VideoViewModel[]>) => {
    const foundVideos = videosLocalRepository.findAllVideos()
    res.status(HTTPStatusCodesEnum.OK_200).send(foundVideos)
})
videosRouter.get('/:id', (req: RequestWithParams<{id: string}>, res: Response<VideoViewModel>) => {
    const foundVideo = videosLocalRepository.findVideoById(req.params.id)
    if (foundVideo) return res.status(HTTPStatusCodesEnum.OK_200).send(foundVideo)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})
videosRouter.post('/', (req: RequestWithBody<CreateVideoInputModel>, res: Response<VideoViewModel | APIErrorResult>) => {
    // Validation
    const createVideoValidationErrors: APIErrorResult = createVideoValidation(req.body)
    if (createVideoValidationErrors.errorMessages.length) {
        res.status(HTTPStatusCodesEnum.Bad_Request_400).send(createVideoValidationErrors)
    }
    // Routing
    const newVideo = videosLocalRepository.createVideo(req.body)
    res.status(HTTPStatusCodesEnum.Created_201).send(newVideo)
})
videosRouter.put('/:id', (req: RequestWithParamsAndBody<{id: string}, UpdateVideoInputModel>, res: Response<APIErrorResult>) => {
    // Validation
    const updateVideoValidationErrors: APIErrorResult = updateVideoValidation(req.body)
    if (updateVideoValidationErrors.errorMessages.length) {
        res.status(HTTPStatusCodesEnum.Bad_Request_400).send(updateVideoValidationErrors)
    }
    // Routing
    const isUpdated = videosLocalRepository.updateVideo(req.params.id, req.body)
    if (!isUpdated) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
})
videosRouter.delete('/:id', (req: RequestWithParams<{id: string}>, res: Response) => {
    const isDeleted = videosLocalRepository.deleteVideoById(req.params.id)
    if (!isDeleted) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
})
