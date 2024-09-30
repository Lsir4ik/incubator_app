import {Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/types";
import {QueryUsersModel} from "../models/users/QueryUsersModel";
import {HTTPStatusCodesEnum} from "../settings";
import {usersQueryRepository} from "../repositories/Mongo/users.db.repository";
import {UserInputModel} from "../models/users/UserInputModel";
import {DeleteByIdParamsUserModel} from "../models/users/DeleteByIdParamsUserModel";
import {usersService} from "../service/users.service";
import {authMiddleware} from "../middlewares/authorization.middleware";
import {createUserValidation} from "../middlewares/validation/users/users.validation.middleware";

export const userRouter = Router();

userRouter.get('/', authMiddleware, async (req: RequestWithQuery<QueryUsersModel>, res: Response) => {
    const foundUsers = await usersQueryRepository.findUsersPagination(
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.searchLoginTerm,
        req.query.searchEmailTerm,
    )
    res.status(HTTPStatusCodesEnum.OK_200).send(foundUsers)
})
userRouter.post('/', authMiddleware, createUserValidation, async (req:RequestWithBody<UserInputModel>, res: Response) => {
    const createdUser = await usersService.createUser(req.body)
    if (createdUser) return res.status(HTTPStatusCodesEnum.Created_201).send(createdUser)
    return res.sendStatus(HTTPStatusCodesEnum.Bad_Request_400)
})
userRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<DeleteByIdParamsUserModel>, res: Response) => {
    const isDeleted = await usersService.deleteUserById(req.params.id)
    if (isDeleted) return res.sendStatus(HTTPStatusCodesEnum.No_Content_204)
    return res.sendStatus(HTTPStatusCodesEnum.Not_Found_404)
})