import jwt from 'jsonwebtoken'
import {appConfig} from "../config/config";

export const jwtService = {
    async createAccessToken(userId: string): Promise<string> {
        return jwt.sign({userId}, appConfig.JWT_SECRET, {expiresIn: appConfig.JWT_EXPIRATION})
    },
    async verifyAccessToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, appConfig.JWT_SECRET) as { userId: string }
        } catch (e) {
            console.error("Token verify some error");
            return null
        }
    },

    // Да, одинаково, но могло бы быть иначе, поэтому пусть :)
    async createRefreshToken(userId: string): Promise<string> {
        return jwt.sign({userId}, appConfig.JWT_SECRET, {expiresIn: appConfig.JWT_REFRESH_EXPIRATION})
    },
    async verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, appConfig.JWT_SECRET) as { userId: string }
        } catch (e) {
            console.error("Token verify some error");
            return null
        }
    }
}