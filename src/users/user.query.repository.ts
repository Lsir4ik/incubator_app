import {PaginatorUserViewModel} from "./types/PaginatorUserViewModel";
import {SortDirection} from "../common/types/sortDirections";
import {UserDbModel} from "./types/UserDbModel";
import {db} from "../db";
import {UserViewModel} from "./types/UserViewModel";
import {ObjectId, WithId} from "mongodb";


export const usersQueryRepository = {
    _userViewTypeMapping(user: WithId<UserDbModel>): UserViewModel {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        }
    },
    async findUserById(id: string): Promise<UserViewModel | null> {
        const foundUser = await db.getCollection().usersCollection.findOne({_id: new ObjectId(id)})
        return foundUser ? this._userViewTypeMapping(foundUser) : null
    },
    async findUsersPagination(sortBy?: string,
                              sortDirection?: string,
                              pageNumber?: string,
                              pageSize?: string,
                              searchLoginTerm?: string,
                              searchEmailTerm?: string): Promise<PaginatorUserViewModel> {
        const dbSortBy = sortBy || 'createdAt'
        const dbSortDirection = sortDirection ? sortDirection === SortDirection.asc ? 1 : -1 : -1
        const dbPageNumber = pageNumber ? Number(pageNumber) : 1
        const dbPageSize = pageSize ? Number(pageSize) : 10
        const dbSearchLoginTerm = searchLoginTerm || null
        const dbSearchEmailTerm = searchEmailTerm || null
        const dbUsersToSkip = (dbPageNumber - 1) * dbPageSize
        const dbLoginSearchRegex = new RegExp(`${dbSearchLoginTerm}`, 'i')
        const dbEmailSearchRegex = new RegExp(`${dbSearchEmailTerm}`, 'i')

        // TODO надо пофиксить - слишком запутанно

        let dbSearchFilter = {}
        if (dbSearchLoginTerm) {
            if (dbSearchEmailTerm) {
                dbSearchFilter = {$or: [{login: {$regex: dbLoginSearchRegex}}, {email: {$regex: dbEmailSearchRegex}}]}
            } else {
                dbSearchFilter = {login: {$regex: dbLoginSearchRegex}}
            }
        } else {
            if (dbSearchEmailTerm) {
                dbSearchFilter = {email: {$regex: dbEmailSearchRegex}}
            } else {
                dbSearchFilter = {}
            }
        }

        const foundUsers = await db.getCollection().usersCollection
            .find(dbSearchFilter)
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbUsersToSkip)
            .limit(dbPageSize)
            .toArray()
        const totalCountOfUsers = await db.getCollection().usersCollection.countDocuments(dbSearchFilter)
        const pagesCountOfUsers = Math.ceil(totalCountOfUsers / dbPageSize)
        const formattedUsers = foundUsers.map(this._userViewTypeMapping)

        return {
            pagesCount: pagesCountOfUsers,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfUsers,
            items: formattedUsers,
        }

    }

}