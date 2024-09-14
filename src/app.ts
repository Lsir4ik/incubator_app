import express, {Request, Response} from 'express'
import cors from 'cors'
import {videosRouter} from "./routes/videosRouter";
import {SETTINGS} from "./settings";
import {testingRouter} from "./routes/testingRouter";

export const app = express();

// Middlewares
app.use(cors()); // разрешить любым фронтам делать запросы на бэк
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах

// Routes
app.use(SETTINGS.PATH.VIDEOS, videosRouter);
app.delete(SETTINGS.PATH.TESTING,testingRouter);