import {Resolutions} from "../../settings";

export interface UpdateVideoInputModel {
    title: string,
    author: string,
    availableResolutions?: Array<Resolutions>, // TODO уточнить необходимость всех полей (в свагере с кравной * только 2 поля)
    canBeDownloaded?: boolean,
    minAgeRestriction?: string,
    publicationDate?: string
}
