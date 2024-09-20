import {BlogViewModel} from "../../models/blogs/BlogViewModel";
import {BlogInputModel} from "../../models/blogs/BlogInputModel";

let blogs:Array<BlogViewModel> = [{
    id: '1',
    name: 'name1',
    description: 'description1',
    webSiteUrl: 'https://blogs.memory.repositories.com',
}]

export const blogsRepository = {
    findAllBlogs(): BlogViewModel[] {
        return blogs;
    },
    findBlogById(id: string): BlogViewModel | undefined {
        return blogs.find(blog => blog.id === id);
    },
    createBlog(data: BlogInputModel): BlogViewModel {
        const newBlog: BlogViewModel = {
            id: new Date().getTime().toString(),
            name: data.name,
            description: data.description,
            webSiteUrl: data.webSiteUrl
        }
        blogs.push(newBlog);
        return newBlog
    },
    updateBlog(id: string, data: BlogInputModel): boolean {
        const foundBlog: BlogViewModel | undefined = blogs.find(blog => blog.id === id);
        if (foundBlog) {
            foundBlog.name = data.name;
            foundBlog.description = data.description;
            foundBlog.webSiteUrl = data.webSiteUrl;
            return true;
        }
        return false;
    },
    deleteBlogById(id: string): boolean {
        const foundBlog:BlogViewModel | undefined = blogs.find(blog => blog.id === id);
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                blogs.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    deleteAllBlogs(): void {
        blogs = []
    }
}