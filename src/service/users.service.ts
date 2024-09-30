import {UserInputModel} from "../models/users/UserInputModel";
import {UserViewModel} from "../models/users/UserViewModel";
import {usersRepository} from "../repositories/Mongo/users.db.repository";
import {LoginInputModel} from "../models/login/LoginInputModel";
import bcrypt from "bcrypt";
import {UserDBViewModel} from "../models/users/UserDBViewModel";

export const usersService = {
    async createUser(dataToCreate: UserInputModel): Promise<UserViewModel | null> {
        const {login, password, email} = dataToCreate
        // Создаем соль
        const passwordSalt = bcrypt.genSaltSync(10)
        // генерируем хэш
        const passwordHash = await this._generateHash(password, passwordSalt)
        // создаем юзера
        const newUser: UserDBViewModel = {
            id: new Date().getTime().toString(),
            login: login,
            email: email,
            passwordSalt: passwordSalt,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
        }
        // отдаем в БД
        const createResult = await usersRepository.createUser(newUser)
        if (!createResult) return null
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt,
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        return usersRepository.deleteUserByID(id);
    },
    async _generateHash(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password,salt)
    },
    async checkCredentials(loginData: LoginInputModel): Promise<boolean> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginData.loginOrEmail)
        if (!foundUser) return false

        const saltOfFoundUser = foundUser.passwordSalt
        const passwordHashOfFoundUser = foundUser.passwordHash
        const passwordHash = await this._generateHash(loginData.password, saltOfFoundUser)
        return passwordHash === passwordHashOfFoundUser;
    },
    async deleteAllUsers(): Promise<void> {
        await usersRepository.deleteAllUsers()
    }
}