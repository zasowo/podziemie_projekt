import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';
import { ObjectId } from 'mongodb';

interface PostData {
  content: object;
  titleInput: string;
  slugInput: string;
  creatorId: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data : PostData = {
      content: body.content,
      titleInput: body.titleInput,
      slugInput: body.slugInput,
      creatorId: body.creatorId
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
    data.slugInput = data.slugInput.replace(/^\/+|\/+$/g, '');
    const protectedSlugs = ['404', 'admin', 'edytor', 'api', 'auth', 'lib', 'pages', 'styles', 'types', 'layouts', 'hooks', 'components', 'user', 'unauthorized'];
    if(protectedSlugs.some(protectedSlug => data.slugInput.startsWith(protectedSlug + '/') || data.slugInput === protectedSlug)) {
      return new Response(
        JSON.stringify({ message: 'Nie można ustawić tego adresu do strony' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const db = await connectToDatabase();
    console.log(data.creatorId)
    await db.collection('pages').insertOne({
      title: data.titleInput,
      slug: data.slugInput,
      content: data.content,
      creatorId: new ObjectId(data.creatorId),
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
