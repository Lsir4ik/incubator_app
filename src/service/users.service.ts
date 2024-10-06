import {UserInputModel} from "../models/users/UserInputModel";
import {UserViewModel} from "../models/users/UserViewModel";
import {usersRepository} from "../repositories/Mongo/users.db.repository";
import {LoginInputModel} from "../models/login/LoginInputModel";
import bcrypt from "bcrypt";
import {UserDBViewModel} from "../models/users/UserDBViewModel";
import {MeViewModel} from "../models/users/MeViewModel";

export const usersService = {
    async createUser(dataToCreate: UserInputModel): Promise<UserViewModel | null> {
        const {login, password, email} = dataToCreate

        // Check unique login or email
        const isLoginExist = await usersRepository.findUserByLoginOrEmail(login)
        const isEmailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (isLoginExist || isEmailExist) return null

        // Создаем соль
        const passwordSalt = await bcrypt.genSalt(10)
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
    async checkCredentials(loginData: LoginInputModel): Promise<UserViewModel | null> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginData.loginOrEmail)
        if (!foundUser) return null

        const saltOfFoundUser = foundUser.passwordSalt
        const passwordHashOfFoundUser = foundUser.passwordHash
        const passwordHash = await this._generateHash(loginData.password, saltOfFoundUser)
        if (passwordHash === passwordHashOfFoundUser) return {
            id: foundUser.id,
            login: foundUser.login,
            email: foundUser.email,
            createdAt: foundUser.createdAt,
        }
        return null
    },
    async deleteAllUsers(): Promise<void> {
        await usersRepository.deleteAllUsers()
    },
    async findUserById(id: string): Promise<UserViewModel | null> {
        return usersRepository.findUserById(id)
    },
    async findMeById(userId: string): Promise<MeViewModel | null> {
        const foundUser = await usersRepository.findUserById(userId)
        if (!foundUser) return null
        return {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser.id,
        }
    }
}