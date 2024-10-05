import {PostViewModel} from "../models/posts/PostViewModel";
import {postsRepository} from "../repositories/Mongo/posts.db.repository";
import {PostInputModel} from "../models/posts/PostInputModel";
import {blogsRepository} from "../repositories/Mongo/blogs.db.repository";
import {postsCollections} from "../db/db";
import {CommentViewModel} from "../models/comments/CommentViewModel";
import {CommentInputModel} from "../models/comments/CommentInputModel";
import {usersRepository} from "../repositories/Mongo/users.db.repository";
import {CommentatorInfo} from "../models/comments/CommentatorInfo";
import {commentsRepository} from "../repositories/Mongo/comments.db.repository";
import {CommentDBViewModel} from "../models/comments/CommentDBViewModel";

export const postsService = {
    async findAllPosts(): Promise<PostViewModel[]> {
        return postsRepository.findAllPosts()
    },
    async findPostById(id: string): Promise<PostViewModel | null> {
        return postsRepository.findPostById(id)
    },
    async createPost(dataToCreate: PostInputModel): Promise<PostViewModel | null> {
        const foundBlog = await blogsRepository.findBlogById(dataToCreate.blogId)
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
            const createdResult = await postsRepository.createPost(newPost)
            if (createdResult) {
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
        }
        return null
    },
    async updatePost(id: string, dataToUpdate: PostInputModel): Promise<boolean> {
        return postsRepository.updatePost(id, dataToUpdate)
    },
    async deletePostById(id: string): Promise<boolean> {
        return postsRepository.deletePostById(id)
    },
    async deleteAllPosts(): Promise<void> {
        return postsRepository.deleteAllPosts()
    },
    async createCommentForPost(postId: string, data: CommentInputModel, userId: string): Promise<CommentViewModel | null> {
        const commentator = await usersRepository.findUserById(userId)

        if (!commentator) return null
        else {
            const commentatorInfo: CommentatorInfo = {
                userId: commentator.id,
                userLogin: commentator.login,
            }
            const newComment: CommentDBViewModel = {
                postId: postId,
                id: new Date().getTime().toString(),
                content: data.content,
                commentatorInfo: commentatorInfo,
                createdAt: new Date().toISOString(),
            }
            const createdResult = await commentsRepository.createComment(newComment)
            if (createdResult) {
                return {
                    id: newComment.id,
                    content: newComment.content,
                    commentatorInfo: newComment.commentatorInfo,
                    createdAt: newComment.createdAt,
                }
            }
            return null
        }
    }
}