import {SETTINGS} from "./settings";
import {app} from "./app";
import {runDb} from "./db/db";


const startApp = async () => {
    await runDb()
    app.listen(SETTINGS.PORT, () => {
        console.log(`Server started at port ${SETTINGS.PORT}`);
    });
}

startApp()
