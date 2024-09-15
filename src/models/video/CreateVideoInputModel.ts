import {Resolutions} from "../../settings";

export interface CreateVideoInputModel {
    title: string,
    author: string,
    availableResolutions?: Array<Resolutions>,
}