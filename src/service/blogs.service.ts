import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";
import {BlogInputModel} from "../models/blogs/BlogInputModel";

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

        // TODO if-else обработка ошибки вставки ???
        await blogsRepository.createBlog(newBlog)
        return newBlog
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