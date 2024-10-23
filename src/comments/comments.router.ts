import {Router, Response} from "express";
import {authBearerGuard} from "../auth/guards/access.token.guard";
import {updateCommentValidator} from "./middlewares/comments.validation.middleware";
import {RequestWithParams, RequestWithParamsAndBody} from "../common/types/requests";
import {IdType} from "../common/types/id";
import {CommentInputModel} from "./types/CommentInputModel";
import {commentsService} from "./comments.service";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {commentsQueryRepository} from "./comments.query.repository";
import {CommentViewModel} from "./types/CommentViewModel";

export const commentsRouter = Router();

commentsRouter.put('/:id', authBearerGuard, updateCommentValidator, async (req:RequestWithParamsAndBody<IdType, CommentInputModel>, res: Response) => {
    const foundComment = await commentsQueryRepository.findCommentById(req.params.id)
    if (!foundComment) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    const isCommentOwner = await commentsService.checkOwn(req.user!.id, foundComment)
    if (!isCommentOwner) return res.sendStatus(HttpStatusCodes.Forbidden_403)
    const updateResult = await commentsService.updateComment(req.params.id, req.body)
    if (!updateResult) return res.sendStatus(HttpStatusCodes.Bad_Request_400) // что при ошибке в базе отправлять?
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
commentsRouter.delete('/:id', authBearerGuard, async (req: RequestWithParams<IdType>, res: Response) => {
    const foundComment = await commentsQueryRepository.findCommentById(req.params.id)
    if (!foundComment) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    const isCommentOwner = await commentsService.checkOwn(req.user!.id, foundComment)
    if (!isCommentOwner) return res.sendStatus(HttpStatusCodes.Forbidden_403)
    const deleteResult = commentsService.deleteCommentById(req.params.id)
    if (!deleteResult) return res.sendStatus(HttpStatusCodes.Bad_Request_400) // что при ошибке в базе отправлять?
    return res.sendStatus(HttpStatusCodes.No_Content_204)
})
commentsRouter.get('/:id', async (req: RequestWithParams<IdType>, res: Response<CommentViewModel>) => {
    const foundComment = await commentsQueryRepository.findCommentById(req.params.id)
    if (!foundComment) return res.sendStatus(HttpStatusCodes.Not_Found_404)
    return res.status(HttpStatusCodes.OK_200).send(foundComment)

})