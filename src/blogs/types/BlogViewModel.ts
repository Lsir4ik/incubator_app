import {BlogDbModel} from "./BlogDbModel";

export type BlogViewModel = {
    id: string
    name: string;
    description: string;
    webSiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}