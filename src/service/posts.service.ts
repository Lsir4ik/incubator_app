import {PostViewModel} from "../models/posts/PostViewModel";
import {postsRepository} from "../repositories/Mongo/posts.db.repository";
import {PostInputModel} from "../models/posts/PostInputModel";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";

export const postsService = {
    async findAllPosts(): Promise<PostViewModel[]> {
        return postsRepository.findAllPosts()
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(dataToCreate: PostInputModel): Promise<PostViewModel | null> {
        const foundBlog = await blogsRepository.findBlogById(dataToCreate.blogId)
        if (foundBlog) {
            const newPost: PostViewModel = {
                id: new Date().getTime().toString(),
                title: dataToCreate.title,
                shortDescription: dataToCreate.shortDescription,
                content: dataToCreate.content,
                blogId: dataToCreate.blogId,
                blogName: foundBlog.name,
                createdAt: new Date().toISOString(),
            }
            return {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt,
            }
        }
        return null
    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        return postsRepository.updatePost(id, dataToUpdate)
    },
    async deletePostById(id: string): Promise<boolean> {
        return postsRepository.deletePostById(id)
    },
    async deleteAllPosts(): Promise<void> {
        return postsRepository.deleteAllPosts()
    }
}