import {PaginatorUserViewModel} from "../../models/users/PaginatorUserViewModel";
import {usersCollections} from "../../db/db";
import {UserDBViewModel} from "../../models/users/UserDBViewModel";
import {SortDirection} from "../../types/types";
import {UserViewModel} from "../../models/users/UserViewModel";

export const usersRepository = {
    async createUser(newUser: UserDBViewModel): Promise<boolean> {
        const createResult = await usersCollections.insertOne(newUser)
        return createResult.acknowledged
    },
    async deleteUserByID(id: string): Promise<boolean> {
        const deleteResult = await usersCollections.deleteOne({ id: id })
        return deleteResult.deletedCount === 1
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBViewModel | null> {
        return usersCollections.findOne(
            {$or: [{login: loginOrEmail}, {email: loginOrEmail}]},
            {projection: {_id: 0}})
        // if (foundUser) return foundUser
        // return null
    },
    async deleteAllUsers(): Promise<void> {
        await usersCollections.deleteMany({})
    },
    async findUserById(id: string): Promise<UserDBViewModel | null> {
        return usersCollections.findOne({id: id})
    }
}

function userTypeMapping (user: UserDBViewModel): UserViewModel {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}

export const usersQueryRepository = {
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

        const foundUsers: UserDBViewModel[] = await usersCollections.find(dbSearchFilter, {projection: {_id: 0}})
            .sort({[dbSortBy]: dbSortDirection})
            .skip(dbUsersToSkip)
            .limit(dbPageSize)
            .toArray()
        const allFoundedUsers = await usersCollections.find(dbSearchFilter).toArray()
        const totalCountOfUsers =  allFoundedUsers.length
        const pagesCountOfUsers = Math.ceil(totalCountOfUsers / dbPageSize)
        const formattedUsers = foundUsers.map(userTypeMapping)

        return {
            pagesCount: pagesCountOfUsers,
            page: dbPageNumber,
            pageSize: dbPageSize,
            totalCount: totalCountOfUsers,
            items: formattedUsers,
        }

    }

}