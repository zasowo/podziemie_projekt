import { client } from "./dbconnection"
import { Db, ObjectId } from "mongodb";

let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (!cachedDb) {
    await client.connect();
    cachedDb = client.db('pages');
  }
  return cachedDb;
}

export async function getAllPages() {
  const db = await connectToDatabase();
  return db.collection<Page>('pages').find().toArray();
}

export async function getUserPages(id: string) {
  const db = await connectToDatabase();
  return db.collection<Page>('pages').find({ creatorId: new ObjectId(id) }).sort({ slug:1 }).toArray();
}


export async function getPageBySlug(slug: string) {
  const db = await connectToDatabase();
  return db.collection<Page>('pages').findOne({ slug });
}

export interface Comment {
  _id: ObjectId | string;
  comment: string;
  name: string;
  userId: ObjectId | string;
}

export interface Page {
  _id: ObjectId;
  title: string;
  slug: string;
  content: object;
  createdAt: Date;
  comments: [Comment]
}