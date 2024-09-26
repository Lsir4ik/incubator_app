import {PostViewModel} from "./PostViewModel";

export type PaginatorPostInputModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<PostViewModel>;
}