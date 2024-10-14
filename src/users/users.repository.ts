import {db} from "../db";
import {UserDbModel} from "./types/UserDbModel";
import {ObjectId, WithId} from "mongodb";

export const usersRepository = {
    async createUser(newUser: UserDbModel): Promise<string> {
        const createResult = await db.getCollection().usersCollection.insertOne(newUser)
        return createResult.insertedId.toString()
    },
    async deleteUserByID(id: string): Promise<boolean> {
        const deleteResult = await db.getCollection().usersCollection.deleteOne({ _id: new ObjectId(id) })
        return deleteResult.deletedCount === 1
    },
    async findUserById(id: string): Promise<WithId<UserDbModel> | null> {
      if (!ObjectId.isValid(id)) return null
        return db.getCollection().usersCollection.findOne({ _id: new ObjectId(id) })
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDbModel> | null> {
        return db.getCollection().usersCollection.findOne({
            $or: [{login: loginOrEmail}, {email: loginOrEmail}]
        })
    },
    async doesExistById(id: string): Promise<boolean> {
        if (!ObjectId.isValid(id)) return false
        const foundUser = await db.getCollection().usersCollection.findOne({ _id: new ObjectId(id) })
        return !! foundUser
    }
}