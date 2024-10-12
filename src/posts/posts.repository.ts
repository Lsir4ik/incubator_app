import {db} from "../db";
import {PostInputModel} from "./types/PostInputModel";
import {PostServiceModel} from "./types/PostServiceModel";
import {ObjectId} from "mongodb";
import {PostDbModel} from "./types/PostDbModel";

export const postsRepository = {
   async findPostById(id: string): Promise<PostServiceModel | null> {
        const foundPost = await db.getCollection().postsCollection.findOne({_id: new ObjectId(id)})
       if (!foundPost) return null
       return {
           id: foundPost._id.toString(),
           title: foundPost.title,
           shortDescription: foundPost.shortDescription,
           content: foundPost.content,
           blogId: foundPost.blogId,
           blogName: foundPost.blogName,
           createdAt: foundPost.createdAt,
       }
    },
    async createPost(newPost: PostDbModel): Promise<string> {
        const createResult = await db.getCollection().postsCollection.insertOne(newPost)
        return createResult.insertedId.toString()
    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        const updateResult = await db.getCollection().postsCollection.updateOne({_id: new ObjectId(id)}, {
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
        const deleteResult = await db.getCollection().postsCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    }
}

