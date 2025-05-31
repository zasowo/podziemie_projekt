import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';
import { auth } from '@/auth';

interface PostData {
  content: object;
  titleInput: string;
  slugInput: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data: PostData = {
      content: body.content,
      titleInput: body.titleInput,
      slugInput: body.slugInput,
    }

    if (!data.content || !data.titleInput || !data.slugInput) {
      return new Response(
        JSON.stringify({ message: 'Brakujące pola formularza' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = await connectToDatabase();
    const doc = await db.collection('pages').findOne({ slug: data.slugInput });

    if (!doc) {
      return new Response(
        JSON.stringify({ message: 'Nie znaleziono strony' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const session = await auth.api.getSession(request);

    if (
      !session ||
      (session.user.role !== 'admin' &&
        !(session.user.role === 'edytor' && doc.creatorId.toString() === session.user.id))
    ) {
      return new Response(
        JSON.stringify({ message: 'Brak uprawnień' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    await db.collection('pages').updateOne(
      { slug: data.slugInput },
      {
        $set: {
          title: data.titleInput,
          content: data.content,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ slug: data.slugInput }), {
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
