import { MongoClient, Db } from "mongodb";

const uri = import.meta.env.MONGODB_URI;
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const client = cachedClient ?? new MongoClient(uri, {});

async function getDb(): Promise<Db> {
    if (!cachedDb) {
        await client.connect();
        cachedDb = client.db(import.meta.env.MONGODB_DB || "mydatabase");
    }
    return cachedDb;
}

// Export client and a promise for db
export { client, getDb };