import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = import.meta.env.MONGODB_URI;

// Create MongoClient instance
const client = new MongoClient(uri, {
    
});

// Optionally, connect immediately (or handle connections asynchronously elsewhere)
client.connect().then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

export {client}