export interface FieldError {
    message: string | null;
    field: string | null;
}
export interface APIErrorResult {
    errorMessages: Array<FieldError>;
}

