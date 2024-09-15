import {Resolutions} from "../../settings";

export interface VideoViewModel {
    id: string,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction?: string | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions?: Resolutions[]
}