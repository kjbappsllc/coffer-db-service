import { MongoClient } from 'mongodb'

const username = process.env.MONGO_INITDB_ROOT_USERNAME
const password = process.env.MONGO_INITDB_ROOT_PASSWORD
const url = `mongodb://${username}:${password}@common_db_1:27017/coffer`

export const mongoClient = {
    connect: () => {
        console.log("Connecting to mongo container ..")
        MongoClient.connect(url, (err, db) => {
            if (err) throw err;
            console.log("Database created!");
            db.close();
        })
    }
}