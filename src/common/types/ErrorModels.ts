export type FieldError = {
    message: string | null;
    field: string | null;
}
export type APIErrorResult = {
    errorMessages: Array<FieldError>;
}

