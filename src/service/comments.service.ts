import {commentsRepository} from "../repositories/Mongo/comments.db.repository";
import {CommentInputModel} from "../models/comments/CommentInputModel";
import {CommentViewModel} from "../models/comments/CommentViewModel";

export const commentsService = {
    async deleteAllComments () {
        await commentsRepository.deleteAllComments()
    },
    async deleteCommentById (id: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(id)
    },
    async updateComment(commentId: string, dataToUpdate: CommentInputModel): Promise<boolean> {
        return commentsRepository.updateComment(commentId, dataToUpdate)
    },
    async findCommentById (id: string): Promise<CommentViewModel | null> {
        const foundComment = await commentsRepository.findCommentById(id)
        if (!foundComment) return null
        return {
            id: foundComment.id,
            content: foundComment.content,
            commentatorInfo: foundComment.commentatorInfo,
            createdAt: foundComment.createdAt,
        }
    },
    async checkOwn (userId: string, comment: CommentViewModel): Promise<boolean> {
        return userId === comment.commentatorInfo.userId
    }
}