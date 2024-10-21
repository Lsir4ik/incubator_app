import {PaginatorBlogViewModel} from "./types/PaginatorBlogViewModel";
import {SortDirection} from "../common/types/sortDirections";
import {db} from "../db";
import {PaginatorPostViewModel} from "../posts/types/PaginatorPostViewModel";
import {PostViewModel} from "../posts/types/PostViewModel";
import {ObjectId, WithId} from "mongodb";
import {BlogDbModel} from "./types/BlogDbModel";
import {BlogViewModel} from "./types/BlogViewModel";
import {PostDbModel} from "../posts/types/PostDbModel";

export const blogsQueryRepository = {
    _blogViewTypeMapping(blog: WithId<BlogDbModel>): BlogViewModel {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership,
        }
    },
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
    async findBlogById (blogId: string): Promise<BlogViewModel | null> {
        const foundBlog = await db.getCollection().blogsCollection.findOne({_id: new ObjectId(blogId)})
        return foundBlog ? this._blogViewTypeMapping(foundBlog) : null
    },
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

        const foundBlogs = await db.getCollection().blogsCollection
            .find(dbSearchFilter)
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbBlogsToSkip)
            .limit(dbPageSize)
            .toArray()
        const totalCountOfBlogs = await db.getCollection().blogsCollection.countDocuments(dbSearchFilter)
        const pagesCountOfBlogs = Math.ceil(totalCountOfBlogs / dbPageSize)

        return {
            pagesCount: pagesCountOfBlogs,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfBlogs,
            items: foundBlogs.map(this._blogViewTypeMapping)
        }
    },
    async getAllPostsOfBlog(blogId: string,
                            pageNumber?: string,
                            pageSize?: string,
                            sortBy?: string,
                            sortDirection?: string): Promise<PaginatorPostViewModel | null> {
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPostsToSkip = (dbPageNumber - 1) * dbPageSize

        const foundPostsOfBlog = await db.getCollection().postsCollection
            .find({blogId: blogId})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbPostsToSkip)
            .limit(dbPageSize)
            .toArray()

        if (foundPostsOfBlog.length === 0) return null

        const totalCountOfPosts = await db.getCollection().postsCollection.countDocuments({blogId: blogId})
        const pagesCountOfFoundedPosts = Math.ceil(totalCountOfPosts / dbPageSize)
        return {
            pagesCount: pagesCountOfFoundedPosts,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfPosts,
            items: foundPostsOfBlog.map(this._postViewTypeMapping)
        }
    }
}