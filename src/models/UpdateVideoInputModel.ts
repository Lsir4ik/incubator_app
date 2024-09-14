import {Resolutions} from "../settings";

export interface UpdateVideoInputModel {
    title: string, // TODO нужны ли в интерфейсе разделители ","
    author: string,
    availableResolutions?: Array<Resolutions>,
    canBeDownloaded: boolean,
    minAgeRestriction?: string,
    publicationDate: string
}
