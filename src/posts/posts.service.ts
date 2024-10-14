import {postsRepository} from "./posts.repository";
import {PostInputModel} from "./types/PostInputModel";
import {blogsRepository} from "../blogs/blogs.repository";
import {PostDbModel} from "./types/PostDbModel";


export const postsService = {
    async createPost(dataToCreate: PostInputModel): Promise<string | null> {
        const foundBlog = await blogsRepository.findBlogById(dataToCreate.blogId)
        if (!foundBlog) return null
        const newPost: PostDbModel = {
            title: dataToCreate.title,
            shortDescription: dataToCreate.shortDescription,
            content: dataToCreate.content,
            blogId: dataToCreate.blogId,
            blogName: foundBlog.name,
            createdAt: new Date(),
        }
        return postsRepository.createPost(newPost)
    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        return postsRepository.updatePost(id, dataToUpdate)
    },
    async isPostExist(id: string): Promise<boolean> {
         const foundPost = postsRepository.findPostById(id)
         return !!foundPost
    },
    async deletePostById(id: string): Promise<boolean> {
        return postsRepository.deletePostById(id)
    },

}