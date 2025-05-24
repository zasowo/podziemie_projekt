import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';


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

    await db.collection('pages').deleteOne(
        { slug: slug },
      );

    return new Response(JSON.stringify({slug:slug}), {
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
