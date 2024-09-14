import {Router, Request, Response} from "express";
import {HTTPStatusCodesEnum, SETTINGS} from "../settings";
import {videosLocalRepository} from "../repositories/Local/videos-in-memory-repository";

export const testingRouter = Router()

testingRouter.delete(SETTINGS.PATH.TESTING, (req: Request, res: Response) => {
    videosLocalRepository.deleteAllVideos();
    res.sendStatus(HTTPStatusCodesEnum.No_Content_204);
})