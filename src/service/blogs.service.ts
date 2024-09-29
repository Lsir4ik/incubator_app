import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";
import {BlogInputModel} from "../models/blogs/BlogInputModel";
import {PostViewModel} from "../models/posts/PostViewModel";
import {postsRepository} from "../repositories/Mongo/posts.db.repository";
import {BlogPostInputModel} from "../models/blogs/BlogPostInputModel";

export const blogsService = {
    async findAllBlogs(): Promise<BlogViewModel[]> {
        return blogsRepository.findAllBlogs()
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsRepository.findBlogById(id)
    },
    async createBlog(dataToCreate: BlogInputModel): Promise<BlogViewModel> {
        const newBlog: BlogViewModel = {
            id: new Date().getTime().toString(),
            name: dataToCreate.name,
            description: dataToCreate.description,
            webSiteUrl: dataToCreate.webSiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        await blogsRepository.createBlog(newBlog)
        return {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            webSiteUrl: newBlog.webSiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },
    async createPostForBlog (blogId: string, dataToCreatePostForBlog: BlogPostInputModel): Promise<PostViewModel | null> {
        const foundBlog = await blogsRepository.findBlogById(blogId)
        if (foundBlog) {
            const newPost: PostViewModel = {
                id: new Date().getTime().toString(),
                title: dataToCreatePostForBlog.title,
                shortDescription: dataToCreatePostForBlog.shortDescription,
                content: dataToCreatePostForBlog.content,
                blogId: blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString(),
            }
            const createdResult  = await postsRepository.createPost(newPost)
            if (createdResult) {
                return {
                    id: newPost.id,
                    title: newPost.title,
                    shortDescription: newPost.shortDescription,
                    content: newPost.content,
                    blogId: newPost.blogId,
                    blogName: newPost.blogName,
                    createdAt: newPost.createdAt
                }
            }
            return null
        }
        return null
    },
    async updateBlog(id: string, dataToUpdate: BlogInputModel): Promise<boolean> {
        return blogsRepository.updateBlog(id, dataToUpdate)
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return blogsRepository.deleteBlogById(id)
    },
    deleteAllBlogs(): Promise<void> {
        return blogsRepository.deleteAllBlogs()
    }
}