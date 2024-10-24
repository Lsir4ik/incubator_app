import {UserInputModel} from "../../src/users/types/UserInputModel";
import {BlogInputModel} from "../../src/blogs/types/BlogInputModel";
import {PostInputModel} from "../../src/posts/types/PostInputModel";
import {BlogPostInputModel} from "../../src/blogs/types/BlogPostInputModel";
import {CommentInputModel} from "../../src/comments/types/CommentInputModel";

export const testDtosCreator = {
    // ---USERS---
    createUserDto({login, email, password}: {login?: string, email?: string, password?: string}): UserInputModel {
        return {
            login: login ?? 'testUser',
            email: email ?? 'testUser@gmail.com',
            password: password ?? 'qwerty',
        }
    },

    // ---BLOGS---
    createBlogDto({name, description, websiteUrl}: {name?: string, description?: string, websiteUrl?: string}): BlogInputModel {
        return {
            name: name ?? 'testBlog',
            description: description ?? 'testBlogDescription',
            websiteUrl: websiteUrl ?? 'http://testBlog.com',
        }
    },
    createBlogPostDto({title, shortDescription, content}: {title?: string, shortDescription?: string, content?: string}): BlogPostInputModel {
        return {
            title: title ?? 'testBlogPost',
            shortDescription: shortDescription ?? 'testBlogPost shortDescription',
            content: content ?? 'testBlogPost content'
        }
    },

    // ---POSTS---
    createPostDto({title, shortDescription, content, blogId}:
                      {title?: string, shortDescription?: string, content?: string, blogId: string}): PostInputModel {
        return {
            title: title ?? 'testPost',
            shortDescription: shortDescription ?? 'testPostShortDescription',
            content: content ?? 'testPostContent',
            blogId,
        }
    },

    // ---Comments---
    createCommentDto({content}: {content?: string}): CommentInputModel {
        return {
            content:  content ?? 'some test content has 20 symbols at least',
        }
    }
}