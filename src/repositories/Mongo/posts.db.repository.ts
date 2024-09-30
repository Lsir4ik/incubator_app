import {PostViewModel} from "../../models/posts/PostViewModel";
import {postsCollections} from "../../db/db";
import {PostInputModel} from "../../models/posts/PostInputModel";
import {PaginatorPostModel} from "../../models/posts/PaginatorPostModel";
import {SortDirection} from "../../models/types";

export const postsRepository = {
    async findAllPosts():Promise<PostViewModel[]> {
        return postsCollections.find({}).toArray()
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return postsCollections.findOne({id: id})
    },
    async createPost(newPost: PostViewModel): Promise<boolean> {
        const createResult = await postsCollections.insertOne(newPost)
        return createResult.acknowledged
    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        const updateResult = await postsCollections.updateOne({id: id}, {
            $set:{
                title: dataToUpdate.title,
                shortDescription: dataToUpdate.shortDescription,
                content: dataToUpdate.content,
                blogId: dataToUpdate.blogId,
            }
        })
        return updateResult.matchedCount === 1
    },
    async deletePostById(id: string): Promise<boolean> {
        const deleteResult = await postsCollections.deleteOne({id: id})
        return deleteResult.deletedCount === 1
    },
    async deleteAllPosts(): Promise<void> {
        await postsCollections.deleteMany({})
    }
}

export const postsQueryRepository = {
    async findPostsPagination (pageNumber?: string,
                               pageSize?: string,
                               sortBy?: string,
                               sortDirection?: string): Promise<PaginatorPostModel> {
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPagedPosts: PostViewModel[] = await postsCollections.find({}, {projection: {_id:0}})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()

        const allPosts = await postsCollections.find({},{projection: {_id:0}}).toArray()
        const totalCountOfPosts = allPosts.length
        const pagesCount = Math.ceil(totalCountOfPosts / dbPageSize)

        return {
            pagesCount: pagesCount,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfPosts,
            items: foundPagedPosts
        }
    }
}