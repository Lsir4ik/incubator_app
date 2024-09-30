export type UserDBViewModel = { // TODO можно ли так, если в Swagger db.UserViewModel??
    id: string
    login: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: string
}