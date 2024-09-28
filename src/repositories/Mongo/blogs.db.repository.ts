import {BlogViewModel} from "../../models/blogs/BlogViewModel";
import {blogsCollections, postsCollections} from "../../db/db";
import {BlogInputModel} from "../../models/blogs/BlogInputModel";
import {PaginatorBlogViewModel} from "../../models/blogs/PaginatorBlogViewModel";
import {SortDirection} from "../../types";
import {PaginatorPostModel} from "../../models/posts/PaginatorPostModel";
import {PostViewModel} from "../../models/posts/PostViewModel";

export const blogsRepository = {
    async findAllBlogs(): Promise<BlogViewModel[]> {
        return blogsCollections.find({}).toArray()
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsCollections.findOne({id: id}, {projection:{_id:0}})
    },
    async createBlog(newBlog: BlogViewModel): Promise<boolean> {
        const createResult = await blogsCollections.insertOne(newBlog)
        return createResult.acknowledged
    },
    async updateBlog(id: string, dataToUpdate: BlogInputModel): Promise<boolean> {
        const updateResult = await blogsCollections.updateOne({id: id}, {
            $set: {
                name: dataToUpdate.name,
                description: dataToUpdate.description,
                webSiteUrl: dataToUpdate.webSiteUrl
            }
        })
        return updateResult.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const deleteResult = await blogsCollections.deleteOne({id: id})
        return deleteResult.deletedCount === 1
    },
    async deleteAllBlogs(): Promise<void> {
        await blogsCollections.deleteMany({})
    }
}


export const blogsQueryRepository = {
    async findBlogsPagination(searchNameTerm?: string,
                              sortBy?: string,
                              sortDirection?: string,
                              pageNumber?: string,
                              pageSize?: string): Promise<PaginatorBlogViewModel> {
        const dbSearchTerm = searchNameTerm || null
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbBlogsToSkip = (dbPageNumber - 1) * dbPageSize
        const dbSearchFilter = dbSearchTerm ? {name: {$regex: new RegExp(`${dbSearchTerm}`, "i")}} : {}

        const foundBlogs: BlogViewModel[] = await blogsCollections.find({dbSearchFilter}, {projection: {_id: 0}})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbBlogsToSkip)
            .limit(dbPageSize)
            .toArray()
        const allFilteredBlogs = await blogsCollections.find({dbSearchFilter}).toArray()
        const totalCountOfBlogs = allFilteredBlogs.length
        const pagesCountOfBlogs = Math.ceil(totalCountOfBlogs / dbPageSize)

        return {
            pagesCount: pagesCountOfBlogs,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfBlogs,
            items: foundBlogs
        }
    },
    async getAllPostsOfBlog(blogId: string,
                            pageNumber?: string,
                            pageSize?: string,
                            sortBy?: string,
                            sortDirection?: string): Promise<PaginatorPostModel | null> {
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPostsOfBlog: PostViewModel[] = await postsCollections.find({blogId: blogId}, {projection: {_id:0}})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()

        if (foundPostsOfBlog.length === 0) {
            return null
        } else {
            const allPostsOfBlog = await postsCollections.find({blogId: blogId}).toArray()
            const totalCountOfPosts = allPostsOfBlog.length
            const pagesCountOfFoundedPosts = Math.ceil(totalCountOfPosts / dbPageSize)
            return {
                pagesCount: pagesCountOfFoundedPosts,
                page: dbPageNumber,
                pageSize: dbPageSize,
                totalCount: totalCountOfPosts,
                items: foundPostsOfBlog
            }
        }
    }
}