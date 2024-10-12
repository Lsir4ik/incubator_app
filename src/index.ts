import {app} from "./app";
import {db} from "./db";
import {appConfig} from "./common/config/config";


const startApp = async () => {
    await db.run(appConfig.MONGO_URL)
    app.listen(appConfig.PORT, () => {
        console.log(`Server started at port ${appConfig.PORT}`);
    });
}

startApp()
