import {UserEmailConfirmation} from "../domain/user.emailConfirmation.entity";

export type UserDbModel = {
    login: string
    email: string
    passwordHash: string
    createdAt: Date
} & UserEmailConfirmation