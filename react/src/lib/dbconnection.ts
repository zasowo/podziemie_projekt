import { MongoClient, Db } from "mongodb";

const uri = import.meta.env.MONGODB_URI;
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
const client = cachedClient ?? new MongoClient(uri, {
    
});

if (cachedClient == null){
    client.connect().then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.error("MongoDB connection error:", error);
    });
}
export {client}