import {VideoViewModel} from "../../models/VideoViewModel";
import {Resolutions} from "../../settings";
import {CreateVideoInputModel} from "../../models/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../../models/UpdateVideoInputModel";

let videos: Array<VideoViewModel> = [
    {
        id: "1",
        title: "string",
        author: "string",
        canBeDownloaded: false,
        minAgeRestriction: "string",
        createdAt: "string",
        publicationDate: "string",
        availableResolutions: [Resolutions.P144, Resolutions.P240, Resolutions.P480]
    },
    {
        id: "2",
        title: "string2",
        author: "string2",
        canBeDownloaded: false,
        minAgeRestriction: "string2",
        createdAt: "string2",
        publicationDate: "string2",
        availableResolutions: [Resolutions.P144, Resolutions.P240, Resolutions.P480],
    }]

export const videosLocalRepository = {
    findAllVideos(): Array<VideoViewModel> {
        return videos;
    },
    findVideoById(id: string): VideoViewModel | undefined {
        return videos.find(v => v.id === id);
    },
    createVideo(body: CreateVideoInputModel): VideoViewModel {
        const newVideo: VideoViewModel = {
            id: new Date().toISOString(),
            title: body.title,
            author: body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: body.availableResolutions
        }
        videos.push(newVideo);
        return newVideo;
    },
    updateVideo(id: string, body: UpdateVideoInputModel): boolean {
        const video = videos.find(v => v.id === id);
        if (video) {
            const indexOfFoundVideo = videos.findIndex(v => v.id === id);
            video.title = body.title;
            video.author = body.author;
            video.availableResolutions = body.availableResolutions;
            video.canBeDownloaded = body.canBeDownloaded;
            video.minAgeRestriction = body.minAgeRestriction;
            video.publicationDate = body.publicationDate;

            videos.splice(indexOfFoundVideo,1, video)
            return true;
        }
        return false;
    },
    deleteVideoById(id: string): boolean {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1)
                return true;
            }
        }
        return false;
    },
    deleteAllVideos(): void {
        videos = []
    }
}