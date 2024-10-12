import {UserInputModel} from "./types/UserInputModel";
import {usersRepository} from "./users.repository";
import {LoginInputModel} from "../auth/types/LoginInputModel";
import {UserDbModel} from "./types/UserDbModel";
import {bcryptService} from "../adapters/bcrypt.service";

export const usersService = {
    async createUser(dataToCreate: UserInputModel): Promise<string | null> {
        const {login, password, email} = dataToCreate

        // Check unique login or email
        const isLoginExist = await usersRepository.findUserByLoginOrEmail(login)
        const isEmailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (isLoginExist || isEmailExist) return null

        const passwordHash = await bcryptService.generateHash(password)
        const newUser: UserDbModel = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
        }
        // отдаем в БД
        return usersRepository.createUser(newUser)

    },
    async deleteUserById(id: string): Promise<boolean> {
        const user = usersRepository.findUserById(id)
        if (!user) return false
        return usersRepository.deleteUserByID(id);
    },

    async checkCredentials(loginData: LoginInputModel): Promise<boolean> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginData.loginOrEmail)
        if (!foundUser) return false

        return bcryptService.checkPassword(loginData.password, foundUser.passwordHash)
    }
}