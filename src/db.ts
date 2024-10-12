import {Db, MongoClient} from "mongodb";
import {appConfig} from "./common/config/config";
import {BlogDbModel} from "./blogs/types/BlogDbModel";
import {PostDbModel} from "./posts/types/PostDbModel";
import {UserDbModel} from "./users/types/UserDbModel";


export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db(appConfig.DB_NAME)
    },
    async run(url: string) {
        try {
            this.client = new MongoClient(url)
            await this.client.connect()
            await db.getDbName().command({ping: 1})
            console.log('Connection successfully to mongo server')
        } catch (e) {
            console.error("Can't connect to mongo server", e)
            await this.client.close()
        }
    },
    async stop() {
        await this.client.close()
        console.log('Connection successfully closed')
    },
    async drop() {
        try {
            const collections = await this.getDbName().listCollections().toArray()

            for (const collection of collections) {
                const collectionName = collection.name
                await this.getDbName().collection(collectionName).deleteMany({})
            }
        } catch (e) {
            console.error("Can't drop db", e)
            await this.stop()
        }
    },
    getCollection() {
        return {
            blogsCollection: this.getDbName().collection<BlogDbModel>('blogs'),
            postsCollection: this.getDbName().collection<PostDbModel>('posts'),
            usersCollection: this.getDbName().collection<UserDbModel>('users')
        }
    }
}