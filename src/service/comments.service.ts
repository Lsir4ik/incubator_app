import {commentsRepository} from "../repositories/Mongo/comments.db.repository";

export const commentsService = {
    async deleteAllComments () {
        await commentsRepository.deleteAllComments()
    }
}