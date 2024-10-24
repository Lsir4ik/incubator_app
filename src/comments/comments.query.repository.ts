import {PaginatorCommentViewModel} from "./types/PaginatorCommentViewModel";
import {SortDirection} from "../common/types/sortDirections";
import {db} from "../db";
import {ObjectId, WithId} from "mongodb";
import {CommentDBModel} from "./types/CommentDBModel";
import {CommentViewModel} from "./types/CommentViewModel";

export const commentsQueryRepository = {
    _commentViewTypeMapping(comment: WithId<CommentDBModel>): CommentViewModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString(),
        }
    },
    async findCommentById (id: string): Promise<CommentViewModel | null> {
        if (!ObjectId.isValid(id)) return null
        const foundComment = await db.getCollection().commentsCollection.findOne({_id: new ObjectId(id)})
        return foundComment
            ? this._commentViewTypeMapping(foundComment)
            : null
    },
    async findCommentsOfPost(postId: string,
                             pageNumber?: string,
                             pageSize?: string,
                             sortBy?: string,
                             sortDirection?: string): Promise<PaginatorCommentViewModel> {
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundComments= await db.getCollection().commentsCollection
            .find({postId: postId})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()
        const totalCountOfComments = await db.getCollection().commentsCollection.countDocuments({postId: postId})
        const pagesCount = Math.ceil(totalCountOfComments / dbPageSize)

        return {
            pagesCount: pagesCount,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfComments,
            items: foundComments.map(this._commentViewTypeMapping)
        }
    }
}