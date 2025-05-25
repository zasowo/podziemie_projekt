import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';
import { auth } from '@/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { slug } = await request.json();

    if (slug == null) {
      return new Response(
        JSON.stringify({ message: 'Brakujące pola formularza' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = await connectToDatabase();

    const doc = await db.collection('pages').findOne({ slug });

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

    await db.collection('pages').deleteOne({ slug });

    return new Response(JSON.stringify({ slug: slug }), {
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
