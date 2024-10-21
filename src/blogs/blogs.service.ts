import {blogsRepository} from "./blogs.repository";
import {BlogInputModel} from "./types/BlogInputModel";
import {postsRepository} from "../posts/posts.repository";
import {BlogPostInputModel} from "./types/BlogPostInputModel";
import {BlogDbModel} from "./types/BlogDbModel";
import {PostDbModel} from "../posts/types/PostDbModel";

export const blogsService = {
    async createBlog(dataToCreate: BlogInputModel): Promise<string> {
        const newBlog: BlogDbModel = {
            name: dataToCreate.name,
            description: dataToCreate.description,
            websiteUrl: dataToCreate.websiteUrl,
            createdAt: new Date(),
            isMembership: false,
        }
        return blogsRepository.createBlog(newBlog)
    },
    async createPostForBlog (blogId: string, dataToCreatePostForBlog: BlogPostInputModel): Promise<string | null> {
        const foundBlog = await blogsRepository.findBlogById(blogId)
        if (!foundBlog) return null
        const newPost: PostDbModel = {
            title: dataToCreatePostForBlog.title,
            shortDescription: dataToCreatePostForBlog.shortDescription,
            content: dataToCreatePostForBlog.content,
            blogId: blogId,
            blogName: foundBlog.name,
            createdAt: new Date(),
        }
        return postsRepository.createPost(newPost)
    },
    async updateBlog(id: string, dataToUpdate: BlogInputModel): Promise<boolean> {
        return blogsRepository.updateBlog(id, dataToUpdate)
    },
    async deleteBlogById(id: string): Promise<boolean> {
        return blogsRepository.deleteBlogById(id)
    }
}