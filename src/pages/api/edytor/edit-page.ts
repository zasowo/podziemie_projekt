// src/pages/api/edytor/edit-page.ts
import type { APIRoute } from 'astro';
import { connectToDatabase, type Page } from '@/lib/pagedb'; 
import { ObjectId } from 'mongodb';
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
    };

    if (!data.content || !data.titleInput || !data.slugInput) {
      return new Response(
        JSON.stringify({ message: 'Brakujące pola formularza' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectToDatabase();
    const existingPage = await db.collection<Page>('pages').findOne({ slug: data.slugInput });

    if (!existingPage) {
      return new Response(
        JSON.stringify({ message: `Nie znaleziono strony o adresie (slug): "${data.slugInput}" do zaktualizowania.` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = await auth.api.getSession(request);

    let canEdit = false;
    if (session?.user.role === 'admin') {
      canEdit = true;
    } else if (session?.user.role === 'edytor' && existingPage.creatorId?.toString() === session?.user.id) {
      canEdit = true;
    }

    if (!canEdit) {
      return new Response(
        JSON.stringify({ message: 'Brak uprawnień do edycji tej strony' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await db.collection<Page>('pages').updateOne(
      { _id: new ObjectId(existingPage._id) }, 
      {
        $set: {
          title: data.titleInput,
          content: data.content,
          updatedAt: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ message: 'Krytyczny błąd: Nie znaleziono dokumentu do zaktualizowania po _id (mimo wcześniejszego znalezienia po slugu)' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (result.modifiedCount === 0 && result.matchedCount === 1) {
      return new Response(
        JSON.stringify({ slug: data.slugInput, message: 'Nie wprowadzono żadnych zmian (dane identyczne).' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ slug: data.slugInput, message: 'Strona zaktualizowana pomyślnie' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Błąd w API /api/edytor/edit-page:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: 'Błąd API: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};