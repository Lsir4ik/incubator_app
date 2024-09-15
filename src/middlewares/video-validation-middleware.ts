import {CreateVideoInputModel} from "../models/video/CreateVideoInputModel";
import {APIErrorResult} from "../models/ErrorModels";
import {Resolutions} from "../settings";
import {UpdateVideoInputModel} from "../models/video/UpdateVideoInputModel";
import {isBooleanObject} from "node:util/types";

// Пока без middleware, просто экпорт функций
let errors: APIErrorResult = {
    errorMessages: []
}
// POST '/video' validation
export const createVideoValidation = (inputVideoData: CreateVideoInputModel) => {
    // Clear errors
    errors.errorMessages = []
    // Title validation
    if (!inputVideoData.title) {
        errors.errorMessages.push({
            message: "Title is required",
            field: "title"
        })
        return errors
    }
    if (inputVideoData.title.length > 40) {
        errors.errorMessages.push({
            message: "Title length should be less than 40 characters",
            field: "title"
        })
        return errors
    }
    // Author validation
    if (!inputVideoData.author) {
        errors.errorMessages.push({
            message: "Author is required",
            field: "author"
        })
        return errors
    }
    if (inputVideoData.author.length > 20) {
        errors.errorMessages.push({
            message: "Author length should be less than 20 characters",
            field: "author"
        })
        return errors
    }
    if (!Array.isArray(inputVideoData.availableResolutions)
        || inputVideoData.availableResolutions.find(p => !Resolutions[p])) {
        errors.errorMessages.push({
            message: "Available resolutions incorrect",
            field: "availableResolutions"
        })
        return errors
    }
    return errors;
}



// PUT '/video' validation
export const updateVideoValidation = (inputVideoData: UpdateVideoInputModel) => {
    // Clear errors
    errors.errorMessages = []

    // Title validation
    if (!inputVideoData.title) {
        errors.errorMessages.push({
            message: "Title is required",
            field: "title"
        })
        return errors;
    }
    if (inputVideoData.title.length > 40) {
        errors.errorMessages.push({
            message: "Title length should be less than 40 characters",
            field: "title"
        })
        return errors;
    }
    if (!inputVideoData.author) {
        errors.errorMessages.push({
            message: "Author is required",
            field: "author"
        })
        return errors;
    }
    if (inputVideoData.author.length > 20) {
        errors.errorMessages.push({
            message: "Author length should be less than 20 characters",
            field: "author"
        })
        return errors;
    }
    if (!Array.isArray(inputVideoData.availableResolutions)
        || inputVideoData.availableResolutions.find(p => !Resolutions[p])) {
        errors.errorMessages.push({
            message: "Available resolutions incorrect",
            field: "availableResolutions"
        })
        return errors;
    }
    if (isBooleanObject(inputVideoData.canBeDownloaded)) {
        errors.errorMessages.push({
            message: "canBeDownloaded should be a boolean value",
            field: "canBeDownloaded"
        })
        return errors;
    }
    if (inputVideoData.minAgeRestriction && (inputVideoData.minAgeRestriction.length > 18 || inputVideoData.minAgeRestriction.length < 1)) {
        errors.errorMessages.push({
            message: "minAgeRestriction length should be less than 18 characters and at least 1 characters",
            field: "minAgeRestriction"
        })
        return errors;
    }
    return errors;
}
