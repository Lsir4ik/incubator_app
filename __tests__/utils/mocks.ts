import {emailManager} from "../../src/common/managers/email.manager";
import {Result, ResultStatus} from "../../src/common/types/result.type";

export const emailManagerMock: typeof emailManager = {
    async sendRegistrationConfirmationEmail(email: string, code: string): Promise<Result<boolean>> {
        return  {
            status:ResultStatus.Success,
            data: true
        }
    }
}