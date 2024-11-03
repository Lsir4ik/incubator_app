import {db} from "../../../db";
import {RefreshTokenDbModel} from "./types/refreshTokenDbModel";

export const refreshTokenRepository = {
    async saveToken(refreshToken: RefreshTokenDbModel): Promise<string> {
        const saveResult = await db.getCollection().refreshTokensCollection.insertOne(refreshToken)
        return saveResult.insertedId.toString()
    },
    async findToken(token: string): Promise<RefreshTokenDbModel | null> {
        return db.getCollection().refreshTokensCollection.findOne({token}, {projection: {_id: 0}})
    },
    async addToBlackList(token: string): Promise<boolean> {
        const updateResult = await db.getCollection().refreshTokensCollection.updateOne({token}, {$set: {isValid: false}})
        return updateResult.matchedCount === 1
    }
}