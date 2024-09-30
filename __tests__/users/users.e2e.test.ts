import {SETTINGS} from "../../src/settings";
import {agent} from "supertest";
import {app} from "../../src/app";

const req = agent(app)

describe('Users', () => {
    beforeAll(async () => {
        await req.delete(SETTINGS.PATH.TESTING)
    })

})