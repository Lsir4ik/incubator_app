import {LoginInputModel} from "./types/LoginInputModel";
import {usersRepository} from "../users/users.repository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {UserDbModel} from "../users/types/UserDbModel";
import {jwtService} from "../common/adapters/jwt.service";
import {UserInputModel} from "../users/types/UserInputModel";
import {Result, ResultStatus} from "../common/types/result.type";
import {v4} from "uuid";
import {emailManager} from "../common/managers/email.manager";
import {add} from "date-fns"

export const authService = {
    async checkCredentials(loginData: LoginInputModel): Promise<Result<boolean | UserDbModel>> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginData.loginOrEmail)
        if (!foundUser) return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'User not found',
            data: false
        }

        const isPassValid =  await bcryptService.checkPassword(loginData.password, foundUser.passwordHash)
        if (!isPassValid) return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'Password incorrect',
            data: false
        }
        if(!foundUser.emailConfirmation.isConfirmed) return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'Email was not confirmed',
            data: false
        }

        return {
            status: ResultStatus.Success,
            data: foundUser
        }
    },
    async loginUser(loginData: LoginInputModel): Promise<string | null> {
        const user = await this.checkCredentials(loginData)
        if (user.status !== ResultStatus.Success) return null
        const userId = user.data as UserDbModel
        return jwtService.createJWT(userId.toString())
    },
    async registerUser(loginData: UserInputModel): Promise<Result<boolean>> {
        const {login, email, password} = loginData
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
        console.log(newUser.emailConfirmation.confirmationCode) // для тестирования
        // Give it to DB and send email
        const newUserId = await usersRepository.createUser(newUser)
        await emailManager.sendRegistrationConfirmationEmail(newUser.email, newUser.emailConfirmation.confirmationCode)
            // .catch((er) => console.error('error in send email:', er));
        return {
            status: ResultStatus.Success,
            data: true
        }
    },
    async confirmRegistration(code: string): Promise<Result<boolean>> {
        const foundUser = await usersRepository.findUserByConfirmationCode(code)
        if (!foundUser) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorsMessages: [{message: 'User with this confirmation code does not exist', field: 'code'}]
            },
            data: false
        }
        if (foundUser.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorsMessages: [{message: 'User already confirmed', field: 'code'}]
            },
            data: false
        }
        if (foundUser.emailConfirmation.expirationDate < new Date()) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorsMessages: [{message: 'Code was expired', field: 'code'}]
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
        const foundUser = await usersRepository.findUserByLoginOrEmail(email)
        if (!foundUser) return {
            status: ResultStatus.NotFound,
            formatError: {
                errorsMessages: [{message: 'User with this email does not exist', field: 'email'}]
            },
            data: false
        }
        if (foundUser.emailConfirmation.isConfirmed) return {
            status: ResultStatus.BadRequest,
            formatError: {
                errorsMessages: [{message: 'User already confirmed', field: 'code'}]
            },
            data: false
        }
        const newConfirmationCode  = v4()
        const updateCodeResult = await usersRepository.updateConfirmationCode(foundUser._id, newConfirmationCode)
        if (updateCodeResult) {
            emailManager.sendRegistrationConfirmationEmail(email, newConfirmationCode)
                .catch((er) => console.error('error in send email:', er));
        } else {
            return {
                status: ResultStatus.ServiceError,
                errorMessage: 'Update code in DB error',
                data: false
            }
        }
        return {
            status: ResultStatus.Success,
            data: true
        }
    }
}
