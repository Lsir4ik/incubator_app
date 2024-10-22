import {APIErrorResult} from "./ErrorModels";

export type Result <T> = {
    status: ResultStatus
    errorMessage?: string
    formatError?: APIErrorResult
    data: T
}

export const enum ResultStatus {
    Success = 'Success',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    BadRequest = 'BadRequest',
    ServiceError = 'ServiceError'
}