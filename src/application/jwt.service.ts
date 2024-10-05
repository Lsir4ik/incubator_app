import {UserViewModel} from "../models/users/UserViewModel";
import {SETTINGS} from "../settings";
import jwt from 'jsonwebtoken'
import {LoginSuccessViewModel} from "../models/login/LoginSuccessViewModel";
import {MeViewModel} from "../models/users/MeViewModel";

export const jwtService = {
    async createJWT (user: UserViewModel): Promise<LoginSuccessViewModel> {
        const token = jwt.sign({userId: user.id}, SETTINGS.JWT_SECRET, {expiresIn: "0.2h"})
        return {accessToken: token}
    },
    async getUserIdByToken(token: string): Promise<string | null> {
        try {
            const result = jwt.verify(token, SETTINGS.JWT_SECRET) as {userId: string}
            return result.userId
        } catch (e) {
            return null
        }
    }
}