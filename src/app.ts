import express, {Request, Response} from 'express'
import cors from 'cors'
import {HTTPStatusCodesEnum, SETTINGS} from "./settings";
import {testingRouter} from "./routes/testing.router";

export const app = express();

// Middlewares
app.use(cors()); // разрешить любым фронтам делать запросы на бэк
app.use(express.json()); // создание свойств-объектов body и query во всех реквестах

// Routes
app.get("/", (req: Request, res: Response) => {
    res.status(HTTPStatusCodesEnum.No_Content_204).send("HW1")
})
app.delete(SETTINGS.PATH.TESTING,testingRouter);