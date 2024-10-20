export type Result <T> = {
    status: ResultStatus
    errorMessage?: string
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