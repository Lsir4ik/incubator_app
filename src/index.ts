import {SETTINGS} from "./settings";
import {app} from "./app";

app.listen(SETTINGS.PORT, () => {
    console.log(`Server started at port ${SETTINGS.PORT}`);
});

// git rm -r --cached .env // TODO GIT
// git add .gitignore
// git commit -m "Stop tracking file"
// git push origin main