import {db} from "../db";
import {ObjectId, WithId} from "mongodb";
import {CommentDBModel} from "./types/CommentDBModel";
import {CommentInputModel} from "./types/CommentInputModel";

export const commentsRepository = {
    async findCommentById(commentId: string): Promise<WithId<CommentDBModel> | null> {
        return db.getCollection().commentsCollection.findOne({_id: new ObjectId(commentId)})
    },
    async createComment(comment: CommentDBModel): Promise<string> {
        const isCreated = await db.getCollection().commentsCollection.insertOne(comment)
        return isCreated.insertedId.toString()
    },
    async updateComment(commentId: string, dataToUpdateComment: CommentInputModel): Promise<boolean> {
        const isUpdated = await db.getCollection().commentsCollection.updateOne({_id: new ObjectId(commentId)}, {
            $set: {
                content: dataToUpdateComment.content,
            }})
        return isUpdated.matchedCount === 1
    },
    async deleteCommentById(commentId: string): Promise<boolean> {
        const isDeleted = await db.getCollection().commentsCollection.deleteOne({_id: new ObjectId(commentId)})
        return isDeleted.deletedCount === 1
    }
}