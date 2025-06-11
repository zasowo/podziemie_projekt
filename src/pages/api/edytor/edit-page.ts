// src/pages/api/edytor/edit-page.ts
import type { APIRoute } from 'astro';
import { connectToDatabase, type Page } from '@/lib/pagedb'; //
import { ObjectId } from 'mongodb';
import { auth } from '@/auth'; //

// Interfejs danych przychodzących z formularza
interface PostData {
  content: object;
  titleInput: string;
  slugInput: string; 
  regionSlug?: string | null;
  organizationSlug?: string | null; // Dodano pole organizacji
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data: PostData = {
      content: body.content,
      titleInput: body.titleInput,
      slugInput: body.slugInput, 
      regionSlug: body.regionSlug,
      organizationSlug: body.organizationSlug, // Pobierz pole organizacji
    };

    if (!data.content || !data.titleInput || !data.slugInput) {
      return new Response(JSON.stringify({ message: 'Brakujące pola formularza' }), { status: 400 });
    }

    const db = await connectToDatabase();
    const existingPage = await db.collection<Page>('pages').findOne({ slug: data.slugInput });

    if (!existingPage) {
      return new Response(JSON.stringify({ message: `Nie znaleziono strony o adresie (slug): "${data.slugInput}"` }), { status: 404 });
    }

    const session = await auth.api.getSession(request);

    // Logika autoryzacji
    let canEdit = false;
    if (session?.user.role === 'admin') {
      canEdit = true;
    } else if (session?.user.role === 'edytor' && existingPage.creatorId?.toString() === session?.user.id) {
      canEdit = true;
    }

    if (!canEdit) {
      return new Response(JSON.stringify({ message: 'Brak uprawnień do edycji tej strony' }), { status: 403 });
    }

    // --- ZMIANA LOGIKI AKTUALIZACJI ---
    // Dynamiczne budowanie obiektu aktualizacji
    const updateFields: Partial<Page> = {
        title: data.titleInput,
        content: data.content,
        updatedAt: new Date(),
    };

    const unsetFields: { [key: string]: string } = {};

    // Logika dla regionSlug
    if (data.regionSlug === null) {
        unsetFields.regionSlug = ""; // Oznacz do usunięcia
    } else if (data.regionSlug !== undefined) {
        updateFields.regionSlug = data.regionSlug; // Oznacz do aktualizacji/dodania
    }

    // Logika dla organizationSlug
    if (data.organizationSlug === null) {
        unsetFields.organizationSlug = ""; // Oznacz do usunięcia
    } else if (data.organizationSlug !== undefined) {
        updateFields.organizationSlug = data.organizationSlug; // Oznacz do aktualizacji/dodania
    }

    const updateOperation: any = { $set: updateFields };
    if (Object.keys(unsetFields).length > 0) {
      updateOperation.$unset = unsetFields;
    }

    // Wykonaj aktualizację w bazie danych
    const result = await db.collection<Page>('pages').updateOne(
      { _id: new ObjectId(existingPage._id) },
      updateOperation
    );
    // --- KONIEC ZMIAN ---


    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ message: 'Nie znaleziono dokumentu do zaktualizowania (błąd wewnętrzny)' }), { status: 404 });
    }
    if (result.modifiedCount === 0) {
      return new Response(JSON.stringify({ slug: data.slugInput, message: 'Nie wprowadzono żadnych zmian.' }), { status: 200 });
    }

    return new Response(
      JSON.stringify({ slug: data.slugInput, message: 'Strona zaktualizowana pomyślnie' }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Błąd w API /api/edytor/edit-page:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: 'Błąd API: ' + error.message }), { status: 500 });
  }
};