import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';

interface PostData {
  content: object;
  titleInput: string;
  slugInput: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data : PostData = {
      content: body.content,
      titleInput: body.titleInput,
      slugInput: body.slugInput,
    }

    if (!data.content || !data.titleInput || !data.slugInput) {
      return new Response('Brakujące pola formularza', { status: 400 });
    }

    const db = await connectToDatabase();
    await db.collection('pages').insertOne({
      title: data.titleInput,
      slug: data.slugInput,
      content: data.content,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({slug:data.slugInput}), {
      status: 201,
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: 'API Error ' + (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
