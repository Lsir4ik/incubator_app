import {config} from 'dotenv';

config();

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || '123',
    PATH: {
        VIDEOS: '/videos',
        TESTING: '/hometask_06/api/testing/all-data',
        BLOGS: '/hometask_06/api/blogs',
        POSTS: '/hometask_06/api/posts',
        AUTH: '/hometask_06/api/auth',
        USERS: '/hometask_06/api/users',
        COMMENTS: '/hometask_06/api/comments',
    }
}

// Code statuses enum
export enum HTTPStatusCodesEnum {
    OK_200 = 200,
    Created_201 = 201,
    No_Content_204 = 204,
    Bad_Request_400 = 400,
    Unauthorized_401 = 401,
    Forbidden_403 = 403,
    Not_Found_404 = 404,
}

export enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
}