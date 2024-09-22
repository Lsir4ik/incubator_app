import {PostViewModel} from "../../models/posts/PostViewModel";
import {blogsCollections, postsCollections} from "../../db/db";
import {PostInputModel} from "../../models/posts/PostInputModel";

export const postRepository = {
    async findAllPosts():Promise<PostViewModel[]> {
        return postsCollections.find({}).toArray()
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return postsCollections.findOne({id: id})
    },
    async createPost(dataToCreate: PostInputModel): Promise<PostViewModel | null> {
        const foundBlog = await blogsCollections.findOne({id: dataToCreate.blogId})
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
            const createResult = await postsCollections.insertOne(newPost)
            // createResult для дальнейшего использования id mongo
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
        const updateResult = await postsCollections.updateOne({id: id}, {
            $set:{
                title: dataToUpdate.title,
                shortDescription: dataToUpdate.shortDescription,
                content: dataToUpdate.content,
                blogId: dataToUpdate.blogId, // TODO будто не надо обновлять
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