import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../common/types/requests";
import {QueryUsersModel} from "./types/QueryUsersModel";
import {UserInputModel} from "./types/UserInputModel";
import {usersService} from "./users.service";
import {baseAuthGuard} from "../auth/guards/base.auth.guard";
import {createUserValidation} from "./middlewares/users.validation.middleware";
import {HttpStatusCodes} from "../common/types/httpsStatusCodes";
import {PaginatorUserViewModel} from "./types/PaginatorUserViewModel";
import {UserViewModel} from "./types/UserViewModel";
import {usersQueryRepository} from "./user.query.repository";
import {IdType} from "../common/types/id";
import {APIErrorResult} from "../common/types/ErrorModels";
import {ResultStatus} from "../common/types/result.type";

export const userRouter = Router();

userRouter.get('/', baseAuthGuard, async (req: RequestWithQuery<QueryUsersModel>, res: Response<PaginatorUserViewModel>) => {
    const foundUsers = await usersQueryRepository.findUsersPagination(
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.searchLoginTerm,
        req.query.searchEmailTerm,
    )
    res.status(HttpStatusCodes.OK_200).send(foundUsers)
})
userRouter.post('/', baseAuthGuard, createUserValidation, async (req:RequestWithBody<UserInputModel>, res: Response<UserViewModel | APIErrorResult>) => {
    const createdUserResult = await usersService.createUser(req.body)
    if (createdUserResult.status !== ResultStatus.Success) return res.status(HttpStatusCodes.Bad_Request_400).send(createdUserResult.formatError)
    const foundUser = await usersQueryRepository.findUserById(createdUserResult.data as  string)
    return res.status(HttpStatusCodes.Created_201).send(foundUser!)

})
userRouter.delete('/:id', baseAuthGuard, async (req: RequestWithParams<IdType>, res: Response) => {
    const isDeleted = await usersService.deleteUserById(req.params.id)
    if (isDeleted) return res.sendStatus(HttpStatusCodes.No_Content_204)
    return res.sendStatus(HttpStatusCodes.Not_Found_404)
})