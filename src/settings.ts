import {config} from 'dotenv';
import {Request} from 'express';

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3000, // TODO наполнение файла .env
    PATH: {
        VIDEOS: '/videos',
        TESTING: '/testing/all-data'
    }
}

// Code statuses enum
export enum CodeResponsesEnum {
    OK_200 = 200,
    Created_201 = 201,
    No_Content_204 = 204,
    Bad_Request_400 = 400,
    Unauthorized_401 = 401,
    Not_Found_404 = 404
}

export enum Resolutions {
    P144,
    P240,
    P360,
    P480,
    P720,
    P1080,
    P1440,
    P2160
}

export type RequestWithParams<T> = Request<T>
export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>