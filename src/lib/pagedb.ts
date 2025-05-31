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
  createdAt: Date;
}

export interface Page {
  _id: ObjectId;
  title: string;
  slug: string;
  content: object;
  createdAt: Date;
  comments: Comment[];
}

export interface LatestCommentInfo {
  pageId: ObjectId | string;
  pageTitle: string;
  pageSlug: string;
  commentId: ObjectId | string;
  commenterName: string;
  commentText: string;
  commentCreatedAt: Date;
  // userRole?: string; // Uncomment if you want to include userRole
}

export async function getLatestPages(limit: number = 6): Promise<Page[]> {
  const db = await connectToDatabase(); 
  const pagesCollection = db.collection<Page>('pages');
  const pages = await pagesCollection.find()
    .sort({ createdAt: -1 }) 
    .limit(limit)             
    .toArray();
  return pages;
}

// src/lib/pagedb.ts (getLatestComments function refined)
export async function getLatestComments(limit: number = 3): Promise<LatestCommentInfo[]> {
  const db = await connectToDatabase();
  const pagesCollection = db.collection<Page>('pages');

  const pagesWithComments = await pagesCollection.find(
    { "comments": { $exists: true, $not: { $size: 0 } } },
    { projection: { _id: 1, title: 1, slug: 1, comments: 1 } } // Fetch the full comments array
  ).toArray();

  let allCommentsFlat: LatestCommentInfo[] = [];
  pagesWithComments.forEach(page => {
    if (page.comments) {
      page.comments.forEach(comment => {
        allCommentsFlat.push({
          pageId: page._id,
          pageTitle: page.title,
          pageSlug: page.slug,
          commentId: comment._id, // This is ObjectId
          commenterName: comment.name,
          commentText: comment.comment,
          commentCreatedAt: comment.createdAt,
          // userRole: comment.userRole (optional)
        });
      });
    }
  });

  // Sort all extracted comments by their creation date, newest first
  allCommentsFlat.sort((a, b) => new Date(b.commentCreatedAt).getTime() - new Date(a.commentCreatedAt).getTime());

  // Return the top 'limit' comments
  return allCommentsFlat.slice(0, limit);
}