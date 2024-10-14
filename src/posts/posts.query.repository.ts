import {PaginatorPostViewModel} from "./types/PaginatorPostViewModel";
import {SortDirection} from "../common/types/sortDirections";
import {PostViewModel} from "./types/PostViewModel";
import {ObjectId, WithId} from "mongodb";
import {db} from "../db";
import {PostDbModel} from "./types/PostDbModel";

export const postsQueryRepository = {
    _postViewTypeMapping(post: WithId<PostDbModel>): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString(),
        }
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        const foundPost = await db.getCollection().postsCollection.findOne({_id: new ObjectId(id)})
        return foundPost ? this._postViewTypeMapping(foundPost) : null
    },
    async findPostsPagination(pageNumber?: string,
                              pageSize?: string,
                              sortBy?: string,
                              sortDirection?: string): Promise<PaginatorPostViewModel> {
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPagedPosts = await db.getCollection().postsCollection
            .find({})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()

        const totalCountOfPosts = await db.getCollection().postsCollection.countDocuments({})
        const pagesCount = Math.ceil(totalCountOfPosts / dbPageSize)

        return {
            pagesCount: pagesCount,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfPosts,
            items: foundPagedPosts.map(this._postViewTypeMapping)
        }
    }
}