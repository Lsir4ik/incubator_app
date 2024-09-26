import {BlogViewModel} from "../../models/blogs/BlogViewModel";
import {blogsCollections} from "../../db/db";
import {BlogInputModel} from "../../models/blogs/BlogInputModel";

export const blogsRepository = {
    async findAllBlogs(): Promise<BlogViewModel[]> {
        return blogsCollections.find({}).toArray()
    },
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return blogsCollections.findOne({id: id})
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

}