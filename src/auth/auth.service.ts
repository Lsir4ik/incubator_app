import {LoginInputModel} from "./types/LoginInputModel";
import {usersRepository} from "../users/users.repository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {ObjectId, WithId} from "mongodb";
import {UserDbModel} from "../users/types/UserDbModel";
import {jwtService} from "../common/adapters/jwt.service";
import {UserInputModel} from "../users/types/UserInputModel";
import {Result, ResultStatus} from "../common/types/result.type";
import {v4} from "uuid";
import {emailManager} from "../common/managers/email.manager";
import {add} from "date-fns"

export const authService = {
    async checkCredentials(loginData: LoginInputModel): Promise<WithId<UserDbModel> | null> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginData.loginOrEmail)
        if (!foundUser) return null

        const isPassValid =  await bcryptService.checkPassword(loginData.password, foundUser.passwordHash)
        if (!isPassValid) return null
        // TODO isConfirmed
        return foundUser
    },
    async loginUser(loginData: LoginInputModel): Promise<string | null> {
        const user = await this.checkCredentials(loginData)
        if (!user) return null

        return jwtService.createJWT(user._id.toString())
    },
    async registerUser(loginData: UserInputModel): Promise<Result<boolean>> {
        const {login, email, password} = loginData

        // Check unique login or email
        const isLoginExist = await usersRepository.findUserByLoginOrEmail(login)
        const isEmailExist = await usersRepository.findUserByLoginOrEmail(email)
        if (isLoginExist || isEmailExist) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorMessages: [{message: 'User with this login data already exists', field: 'email'}]
            },
            data: false
        }

        // create user entity and generate confirmationCode with uuidv4
        const passwordHash = await bcryptService.generateHash(password)
        const newUser: UserDbModel = {
            login,
            email,
            passwordHash,
            createdAt: new Date(),
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    minutes: 10,
                }),
                isConfirmed: false
            }
        }
        // Give it to DB and send email
        const newUserId = await usersRepository.createUser(newUser)
        // TODO стоит ли убрать await, как обработать catch
        const sendEmailResult = await emailManager
            .sendRegistrationConfirmationEmail(newUser.email, newUser.emailConfirmation.confirmationCode)
        // TODO уточнить на поддержке
        // if (sendEmailResult.status === ResultStatus.ServiceError) {
        //     await usersRepository.deleteUserByID(newUserId)
        //     return {
        //         status: ResultStatus.ServiceError,
        //         errorMessage: 'Something went wrong, user was deleted',
        //         data: false
        //     }
        // }
        return {
            status: ResultStatus.Success,
            data: true
        }
    },
    async confirmRegistration(code: string): Promise<Result<boolean>> {
        const foundUser = await usersRepository.findUserByConfirmationCode(code)
        if (foundUser?.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorMessages: [{message: 'User already confirmed', field: 'code'}]
            },
            data: false
        }
        if (!foundUser) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorMessages: [{message: 'User with this confirmation code does not exist', field: 'code'}]
            },
            data: false
        }
        if (foundUser.emailConfirmation.expirationDate < new Date()) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorMessages: [{message: 'Code was expired', field: 'code'}]
            },
            data: false
        }
        await usersRepository.confirmEmail(code)
        return {
            status: ResultStatus.Success,
            errorMessage: 'User email was confirmed',
            data: true
        }
    },
    async registrationEmailResending(email: string): Promise<Result<boolean>> {
        // TODO уточнить на поддержке нужна ли эта проверка
        const foundUser = await usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser) return {
            status: ResultStatus.NotFound,
            errorMessage: 'User with this email does not exist',
            data: false
        }
        const sendEmailResult = await emailManager
            .sendRegistrationConfirmationEmail(email, foundUser.emailConfirmation.confirmationCode)
        // TODO уточнить на поддержке
        // if (sendEmailResult.status === ResultStatus.ServiceError) {
        //     await usersRepository.deleteUserByID(new ObjectId(foundUser._id).toString())
        //     return {
        //         status: ResultStatus.ServiceError,
        //         errorMessage: 'Something went wrong, user was deleted',
        //         data: false
        //     }
        // }
        return {
            status: ResultStatus.Success,
            data: true
        }
    }
}
