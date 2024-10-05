import {UserViewModel} from "../models/users/UserViewModel";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}