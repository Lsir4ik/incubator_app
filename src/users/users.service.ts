import {UserInputModel} from "./types/UserInputModel";
import {usersRepository} from "./users.repository";
import {UserDbModel} from "./types/UserDbModel";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {v4} from "uuid";
import {Result, ResultStatus} from "../common/types/result.type";

export const usersService = {
    async createUser(dataToCreate: UserInputModel): Promise<Result<string | boolean>> {
        const {login, password, email} = dataToCreate
        // Check unique login or email
        const isLoginExist = await usersRepository.findUserByLoginOrEmail(login)
        const isEmailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (isLoginExist || isEmailExist) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorsMessages: [{message: 'User with this login data already exists', field: 'email'}]
            },
            data: false
        }

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
        const newUserId = await usersRepository.createUser(newUser)
        return {
            status: ResultStatus.Success,
            data: newUserId
        }
    },
    async deleteUserById(id: string): Promise<boolean> {
        const user = usersRepository.findUserById(id)
        if (!user) return false
        return usersRepository.deleteUserByID(id);
    },

}