import type { APIRoute } from 'astro';
import { connectToDatabase } from '../../lib/pagedb';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const title = formData.get('title')?.toString();
  const slug = formData.get('slug')?.toString();
  const content = formData.get('content')?.toString();

  if (!title || !slug || !content) {
    return new Response('Missing fields', { status: 400 });
  }

  const db = await connectToDatabase();
  await db.collection('pages').insertOne({
    title,
    slug,
    content,
    createdAt: new Date(),
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/pages/${slug}`,
    },
  });
};
