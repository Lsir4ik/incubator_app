import {Router, Request, Response} from "express";
import {videosLocalRepository} from "../repositories/Local/videos-in-memory-repository";
import {CodeResponsesEnum} from "../settings";
import {createVideoValidation, updateVideoValidation} from "../middlewares/video-validation-middleware";
import {APIErrorResult} from "../models/ErrorModels";

export const videosRouter = Router();

videosRouter.get('/', (req: Request, res: Response) => {
    const foundVideos = videosLocalRepository.findAllVideos()
    res.status(CodeResponsesEnum.OK_200).send(foundVideos)
})
videosRouter.get('/:id', (req: Request, res: Response) => {
    const foundVideo = videosLocalRepository.findVideoById(req.params.id)
    if (foundVideo) return res.status(CodeResponsesEnum.OK_200).send(foundVideo)
    return res.sendStatus(CodeResponsesEnum.Not_Found_404)
})
videosRouter.post('/', (req: Request, res: Response) => {
    // Validation
    const createVideoValidationErrors: APIErrorResult = createVideoValidation(req.body)
    if (createVideoValidationErrors.errorMessages.length) {
        res.status(CodeResponsesEnum.Bad_Request_400).send(createVideoValidationErrors)
    }

    const newVideo = videosLocalRepository.createVideo(req.body)
    res.status(CodeResponsesEnum.OK_200).send(newVideo)
})
videosRouter.put('/:id', (req: Request, res: Response) => {
    // Validation
    const updateVideoValidationErrors: APIErrorResult = updateVideoValidation(req.body)
    if (updateVideoValidationErrors.errorMessages.length) {
        res.status(CodeResponsesEnum.Bad_Request_400).send(updateVideoValidationErrors)
    }

    const isUpdated = videosLocalRepository.updateVideo(req.params.id, req.body)
    if (!isUpdated) return res.sendStatus(CodeResponsesEnum.Not_Found_404)
    return res.sendStatus(CodeResponsesEnum.No_Content_204)
})
videosRouter.delete('/:id', (req: Request, res: Response) => {
    const isDeleted = videosLocalRepository.deleteVideoById(req.params.id)
    if (!isDeleted) return res.sendStatus(CodeResponsesEnum.Not_Found_404)
    return res.sendStatus(CodeResponsesEnum.No_Content_204)
})
