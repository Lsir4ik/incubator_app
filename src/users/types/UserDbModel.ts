import {UserEmailConfirmation} from "../domain/user.emailConfirmation.model";

export type UserDbModel = {
    login: string
    email: string
    passwordHash: string
    createdAt: Date
} & UserEmailConfirmation