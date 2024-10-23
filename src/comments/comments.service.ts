import {commentsRepository} from "./comments.repository";
import {CommentInputModel} from "./types/CommentInputModel";
import {CommentViewModel} from "./types/CommentViewModel";
import {usersRepository} from "../users/users.repository";
import {CommentatorInfo} from "./types/CommentatorInfo";
import {CommentDBModel} from "./types/CommentDBModel";


export const commentsService = {
    async deleteCommentById (id: string): Promise<boolean> {
        return commentsRepository.deleteCommentById(id)
    },
    async updateComment(commentId: string, dataToUpdate: CommentInputModel): Promise<boolean> {
        return commentsRepository.updateComment(commentId, dataToUpdate)
    },
    async checkOwn (userId: string, comment: CommentViewModel): Promise<boolean> {
        return userId === comment.commentatorInfo.userId
    },
    async createCommentForPost(postId: string, data: CommentInputModel, userId: string): Promise<string | null> {
        const commentator = await usersRepository.findUserById(userId) // разве юзера здесь может не быть?
        if (!commentator) return null

        const commentatorInfo: CommentatorInfo = {
            userId: commentator._id.toString(),
            userLogin: commentator.login,
        }
        const newComment: CommentDBModel = {
            postId: postId,
            content: data.content,
            commentatorInfo: commentatorInfo,
            createdAt: new Date(),
        }
        return commentsRepository.createComment(newComment)
    }
}