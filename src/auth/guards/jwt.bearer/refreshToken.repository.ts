import {db} from "../../../db";
import {RefreshTokensDbModel} from "./types/refreshTokenDbModel";

export const refreshTokenRepository = {
    async saveToken(refreshToken: RefreshTokensDbModel): Promise<string> {
        const saveResult = await db.getCollection().refreshTokensCollection.insertOne(refreshToken)
        return saveResult.insertedId.toString()
    }
}