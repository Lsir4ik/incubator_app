import {PostViewModel} from "../../models/posts/PostViewModel";
import {PostInputModel} from "../../models/posts/PostInputModel";
import {blogsRepository} from "./blogs.memory.repository";
import {BlogViewModel} from "../../models/blogs/BlogViewModel";

let posts: Array<PostViewModel> = [{
    id: '1',
    title: 'string',
    shortDescription: 'string',
    content: 'string',
    blogId: 'string',
    blogName: 'string'
}];

export const postRepository = {
    findAllPosts(): PostViewModel[] {
        return posts
    },
    findPostById(id: string): PostViewModel | undefined {
        return posts.find(post => post.id === id);
    },
    createPost(data: PostInputModel): PostViewModel | null {
        const blogNameById: BlogViewModel | undefined = blogsRepository.findBlogById(data.blogId)
        if (blogNameById) {
            const newPost: PostViewModel = {
                id: new Date().getTime().toString(),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: blogNameById.name
            }
            posts.push(newPost);
            return newPost
        }
        return null
    },
    updatePost(id: string, data: PostInputModel): boolean {
        const foundPost: PostViewModel | undefined = posts.find(post => post.id === id);
        if (foundPost) {
            foundPost.title = data.title;
            foundPost.shortDescription = data.shortDescription;
            foundPost.content = data.content;
            foundPost.blogId = data.blogId;
            return true;
        }
        return false;
    },
    deletePostById(id: string): boolean {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1);
                return true
            }
        }
        return false;
    },
    deleteAllPosts(): void {
        posts = []
    }
}