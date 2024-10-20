import {UserInputModel} from "./types/UserInputModel";
import {usersRepository} from "./users.repository";
import {UserDbModel} from "./types/UserDbModel";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {v4} from "uuid";

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
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: new Date(),
                isConfirmed: true
            }
        }
        // отдаем в БД
        return usersRepository.createUser(newUser)

    },
    async deleteUserById(id: string): Promise<boolean> {
        const user = usersRepository.findUserById(id)
        if (!user) return false
        return usersRepository.deleteUserByID(id);
    },

}