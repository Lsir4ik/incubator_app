import {config} from "dotenv";

config()

export const appConfig = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL as string,
    DB_NAME: process.env.DB_NAME as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    MAIL_CFG: {
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL as string,
            pass: process.env.EMAIL_PASSWORD as string,
        }
    }
}

// EMAIL_PASSWORD=IncubatorTest123
// EMAIL=incubatorslazarev@gmail.com