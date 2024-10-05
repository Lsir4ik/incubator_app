import {CommentatorInfo} from "./CommentatorInfo";

export type CommentDBViewModel = {
    postId: string;
    id: string;
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}