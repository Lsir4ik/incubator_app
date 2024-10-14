import {LoginInputModel} from "./types/LoginInputModel";
import {usersRepository} from "../users/users.repository";
import {bcryptService} from "../common/adapters/bcrypt.service";
import {WithId} from "mongodb";
import {UserDbModel} from "../users/types/UserDbModel";
import {jwtService} from "../common/adapters/jwt.service";
import {LoginSuccessViewModel} from "./types/LoginSuccessViewModel";

export const authService = {
    async checkCredentials(loginData: LoginInputModel): Promise<WithId<UserDbModel> | null> {
        const foundUser = await usersRepository.findUserByLoginOrEmail(loginData.loginOrEmail)
        if (!foundUser) return null

        const isPassValid =  await bcryptService.checkPassword(loginData.password, foundUser.passwordHash)
        if (!isPassValid) return null

        return foundUser
    },
    async loginUser(loginData: LoginInputModel): Promise<string | null> {
        const user = await this.checkCredentials(loginData)
        if (!user) return null

        return jwtService.createJWT(user._id.toString())
    }
}
