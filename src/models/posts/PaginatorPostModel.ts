import {PostViewModel} from "./PostViewModel";

export type PaginatorPostModel = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: Array<PostViewModel>;
}