import jwt from 'jsonwebtoken'
import {appConfig} from "../config/config";

export const jwtService = {
    async createJWT(userId: string): Promise<string> {
        return jwt.sign({userId}, appConfig.JWT_SECRET, {expiresIn: "0.2h"})
    },
    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, appConfig.JWT_SECRET) as { userId: string }
        } catch (e) {
            console.error("Token verify some error");
            return null
        }
    }
}