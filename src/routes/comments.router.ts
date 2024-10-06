import {Router, Response} from "express";
import {authBarerMiddleware} from "../middlewares/authorization.middleware";
import {HTTPStatusCodesEnum} from "../settings";
import {commentsService} from "../service/comments.service";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/types";
import {ParamsCommentInputModel} from "../models/comments/ParamsCommentInputModel";
import {CommentInputModel} from "../models/comments/CommentInputModel";
import {updateCommentValidator} from "../middlewares/validation/comments/comments.validation.middleware";

export const commentsRouter = Router();

commentsRouter.put('/:id', authBarerMiddleware, updateCommentValidator, async (req:RequestWithParamsAndBody<ParamsCommentInputModel, CommentInputModel>, res: Response) => {
    const foundComment = await commentsService.findCommentById(req.params.id)
    if (!foundComment) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    const isCommentOwner = await commentsService.checkOwn(req.user!.id, foundComment)
    if (!isCommentOwner) return res.sendStatus(HTTPStatusCodesEnum.Forbidden_403)
    const updateResult = await commentsService.updateComment(req.params.id, req.body)
    if (!updateResult) return res.sendStatus(HTTPStatusCodesEnum.Bad_Request_400) // TODO что при ошибке в базе отправлять?
    return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
})
commentsRouter.delete('/:id', authBarerMiddleware, async (req: RequestWithParams<ParamsCommentInputModel>, res: Response) => {
    const foundComment = await commentsService.findCommentById(req.params.id)
    if (!foundComment) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    const isCommentOwner = await commentsService.checkOwn(req.user!.id, foundComment)
    if (!isCommentOwner) return res.sendStatus(HTTPStatusCodesEnum.Forbidden_403)
    const deleteResult = commentsService.deleteCommentById(req.params.id)
    if (!deleteResult) return res.sendStatus(HTTPStatusCodesEnum.Bad_Request_400) // TODO что при ошибке в базе отправлять?
    return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
})
commentsRouter.get('/:id', async (req: RequestWithParams<ParamsCommentInputModel>, res: Response) => {
    const foundComment = await commentsService.findCommentById(req.params.id)
    if (!foundComment) return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
    return res.status(HTTPStatusCodesEnum.OK_200).send(foundComment)

})