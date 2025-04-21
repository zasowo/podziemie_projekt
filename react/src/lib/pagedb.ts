import {client} from "./dbconnection"
import { Db } from "mongodb";

let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (!cachedDb) {
    await client.connect();
    cachedDb = client.db('pages');
  }
  return cachedDb;
}

export async function getPageBySlug(slug: string) {
    const db = await connectToDatabase();
    return db.collection<Page>('pages').findOne({ slug });
  }
  
  export interface Page {
    title: string;
    slug: string;
    content: string;
    createdAt: Date;
  }