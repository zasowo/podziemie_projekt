import {client} from "./dbconnection"
import { Db } from "mongodb";

let db : Db;

export async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('test');
  }
  return db;
}