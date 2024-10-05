import {CommentViewModel} from "../../models/comments/CommentViewModel";
import {commentsCollections, usersCollections} from "../../db/db";
import {CommentInputModel} from "../../models/comments/CommentInputModel";
import {CommentDBViewModel} from "../../models/comments/CommentDBViewModel";

export const commentsRepository = {
    async findCommentById(commentId: string): Promise<CommentViewModel | null> {
        return commentsCollections.findOne({id: commentId})
    },
    async createComment(comment: CommentDBViewModel): Promise<boolean> {
        const isCreated = await commentsCollections.insertOne(comment)
        return isCreated.acknowledged
    },
    async updateComment(commentId: string, dataToUpdateComment: CommentInputModel): Promise<boolean> {
        const isUpdated = await commentsCollections.updateOne({id: commentId}, {
            $set: {
                content: dataToUpdateComment.content,
            }})
        return isUpdated.matchedCount === 1
    },
    async deleteCommentById(commentId: string): Promise<boolean> {
        const isDeleted = await commentsCollections.deleteOne({id: commentId})
        return isDeleted.deletedCount === 1
    },
    async deleteAllComments() {
        await commentsCollections.deleteMany({})
    }
}