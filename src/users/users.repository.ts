import {db} from "../db";
import {UserDbModel} from "./types/UserDbModel";
import {ObjectId, WithId} from "mongodb";
import {UserEmailConfirmation} from "./domain/user.emailConfirmation.entity";

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
    },
    async findUserByConfirmationCode(code: string): Promise<UserEmailConfirmation | null> {
        const foundUser = await db.getCollection().usersCollection
            .findOne({"emailConfirmation.confirmationCode": code})
        if (!foundUser) return null
        return {
            emailConfirmation: {
                confirmationCode: foundUser.emailConfirmation.confirmationCode,
                expirationDate: foundUser.emailConfirmation.expirationDate,
                isConfirmed: foundUser.emailConfirmation.isConfirmed,
            }
        }
    },
    async confirmEmail(code: string): Promise<boolean> {
        const isUpdated = await db.getCollection().usersCollection.updateOne({'emailConfirmation.confirmationCode': code}, {
            $set: {
                'emailConfirmation.isConfirmed': true
            }
        })
        return isUpdated.matchedCount === 1
    },
    async updateConfirmationCode(userId: ObjectId, code: string): Promise<boolean> {
        const isUpdated = await db.getCollection().usersCollection.updateOne({_id: new ObjectId(userId)}, {
            $set: {
                'emailConfirmation.confirmationCode': code
            }
        })
        return isUpdated.matchedCount === 1
    }
}