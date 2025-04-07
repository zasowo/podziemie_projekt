import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // MongoDB URI (adjust as needed)
const databaseName = "yourDatabaseName"; // Database name

// Create MongoClient instance
const client = new MongoClient(uri, {
});

// Optionally, connect immediately (or handle connections asynchronously elsewhere)
client.connect().then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

export { client }; // Export client for use elsewhere