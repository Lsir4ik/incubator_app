import {db} from "../db";
import {BlogInputModel} from "./types/BlogInputModel";
import {BlogServiceModel} from "./types/BlogServiceModel";
import {ObjectId} from "mongodb";
import {BlogDbModel} from "./types/BlogDbModel";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogServiceModel | null> {
        const fondBlog = await db.getCollection().blogsCollection.findOne({_id: new ObjectId(id)})
        if (fondBlog) {
            return {
                id: fondBlog._id.toString(),
                name: fondBlog.name,
                description: fondBlog.description,
                webSiteUrl: fondBlog.webSiteUrl,
                createdAt: fondBlog.createdAt,
                isMembership: fondBlog.isMembership,
            }
        }
        return null
    },
    async createBlog(newBlog: BlogDbModel): Promise<string> {
        const createResult = await db.getCollection().blogsCollection.insertOne(newBlog)
        return createResult.insertedId.toString()
    },
    async updateBlog(id: string, dataToUpdate: BlogInputModel): Promise<boolean> {
        const updateResult = await db.getCollection().blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                name: dataToUpdate.name,
                description: dataToUpdate.description,
                webSiteUrl: dataToUpdate.webSiteUrl
            }
        })
        return updateResult.matchedCount === 1
    },
    async deleteBlogById(id: string): Promise<boolean> {
        const deleteResult = await db.getCollection().blogsCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    }
}


