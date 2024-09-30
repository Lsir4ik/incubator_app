import {config} from "dotenv";
import {MongoClient} from "mongodb";
import {BlogViewModel} from "../models/blogs/BlogViewModel";
import {PostViewModel} from "../models/posts/PostViewModel";
import {UserViewModel} from "../models/users/UserViewModel";
import {UserDBViewModel} from "../models/users/UserDBViewModel";

config()

// Connecting URL
// const url = process.env.MONGO_URL
const url = 'mongodb://localhost:27017';
console.log('url', url);
if (!url) {
    throw new Error('MongoDB URL is missing');
}
export const client = new MongoClient(url, {})
const db = client.db('incubator-app-dev')
export const blogsCollections = db.collection<BlogViewModel>('blogs')
export const postsCollections = db.collection<PostViewModel>('posts')
export const usersCollections = db.collection<UserDBViewModel>('users')

export const runDb = async () => {
    try {
        await client.connect()
        await db.command({ping: 1})
        console.log('Connection successfully to server')
    } catch (e) {
        console.log('Don\'t connected successfully to server')
        await client.close()
    }
}