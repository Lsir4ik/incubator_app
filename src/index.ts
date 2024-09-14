import {SETTINGS} from "./settings";
import {app} from "./app";

app.listen(SETTINGS.PORT, () => {
    console.log(`Server started at port ${SETTINGS.PORT}`);
});