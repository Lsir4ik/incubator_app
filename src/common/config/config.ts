import {config} from "dotenv";

config()

export const appConfig = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL as string,
    DB_NAME: process.env.DB_NAME as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
}