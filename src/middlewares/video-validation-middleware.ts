import {CreateVideoInputModel} from "../models/CreateVideoInputModel";
import {APIErrorResult} from "../models/ErrorModels";
import {Resolutions} from "../settings";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";
import {isBooleanObject} from "node:util/types";

// Пока без middleware, просто экпорт функций

// POST '/video' validation
export const createVideoValidation = (inputVideoData: CreateVideoInputModel) => {
    const errors: APIErrorResult = {
        errorMessages: []
    }
    // Title validation
    if (!inputVideoData.title) {
        errors.errorMessages.push({
            message: "Title is required",
            field: "title"
        })
    }
    if (inputVideoData.title.length > 40) {
        errors.errorMessages.push({
            message: "Title length should be less than 40 characters",
            field: "title"
        })
    }
    // Author validation
    if (!inputVideoData.author) {
        errors.errorMessages.push({
            message: "Author is required",
            field: "author"
        })
    }
    if (inputVideoData.author.length > 20) {
        errors.errorMessages.push({
            message: "Author length should be less than 20 characters",
            field: "author"
        })
    }
    if (!Array.isArray(inputVideoData.availableResolutions)
        || inputVideoData.availableResolutions.find(p => !Resolutions[p])) {
        errors.errorMessages.push({
            message: "Available resolutions incorrect",
            field: "availableResolutions"
        })
    }
    return errors;
}

// PUT '/video' validation
export const updateVideoValidation = (inputVideoData: UpdateVideoInputModel) => {
    const errors: APIErrorResult = {
        errorMessages: []
    }
    // Title validation
    if (!inputVideoData.title) {
        errors.errorMessages.push({
            message: "Title is required",
            field: "title"
        })
    }
    if (inputVideoData.title.length > 40) {
        errors.errorMessages.push({
            message: "Title length should be less than 40 characters",
            field: "title"
        })
    }
    if (!inputVideoData.author) {
        errors.errorMessages.push({
            message: "Author is required",
            field: "author"
        })
    }
    if (inputVideoData.author.length > 20) {
        errors.errorMessages.push({
            message: "Author length should be less than 20 characters",
            field: "author"
        })
    }
    if (!Array.isArray(inputVideoData.availableResolutions)
        || inputVideoData.availableResolutions.find(p => !Resolutions[p])) {
        errors.errorMessages.push({
            message: "Available resolutions incorrect",
            field: "availableResolutions"
        })
    }
    if (isBooleanObject(inputVideoData.canBeDownloaded)) {
        errors.errorMessages.push({
            message: "canBeDownloaded should be a boolean value",
            field: "canBeDownloaded"
        })
    }
    if (inputVideoData.minAgeRestriction && (inputVideoData.minAgeRestriction.length > 18 || inputVideoData.minAgeRestriction.length < 1)) {
        errors.errorMessages.push({
            message: "minAgeRestriction length should be less than 18 characters and at least 1 characters",
            field: "minAgeRestriction"
        })
    }
    return errors;
}
