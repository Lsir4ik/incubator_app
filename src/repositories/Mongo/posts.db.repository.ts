import {PostViewModel} from "../../models/posts/PostViewModel";
import {blogsCollections, postsCollections} from "../../db/db";
import {PostInputModel} from "../../models/posts/PostInputModel";

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