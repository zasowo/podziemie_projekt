import {

    betterAuth

} from 'better-auth';
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // MongoDB URI (adjust as needed)
const databaseName = "authbase"; // Database name

// Create MongoClient instance
const client = new MongoClient(uri, {
});

// Optionally, connect immediately (or handle connections asynchronously elsewhere)
client.connect().then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});

export const auth = betterAuth({
    database: mongodbAdapter(client.db()),
    baseURL: "https://podziemie.com.pl",
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
		maxPasswordLength: 128,
    },
    trustedOrigins: ['https://podziemie.com.pl', 'http://localhost:4321']


    /** if no database is provided, the user data will be stored in memory.

     * Make sure to provide a database to persist user data **/

});