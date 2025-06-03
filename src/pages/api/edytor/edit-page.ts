// src/pages/api/edytor/edit-page.ts
import type { APIRoute } from 'astro';
import { connectToDatabase, type Page } from '@/lib/pagedb'; //
import { ObjectId } from 'mongodb';
import { auth } from '@/auth'; //

interface PostData {
  content: object;
  titleInput: string;
  slugInput: string; // Ten slug powinien być ORYGINALNYM slugiem edytowanej strony
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const data: PostData = {
      content: body.content,
      titleInput: body.titleInput,
      slugInput: body.slugInput, // Ten slug jest używany do ZNALEZIENIA strony
    };

    if (!data.content || !data.titleInput || !data.slugInput) {
      return new Response(
        JSON.stringify({ message: 'Brakujące pola formularza' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectToDatabase();
    // Krok 1: Znajdź stronę na podstawie przekazanego sluga (który jest oryginalnym slugiem)
    const existingPage = await db.collection<Page>('pages').findOne({ slug: data.slugInput });

    if (!existingPage) {
      return new Response(
        JSON.stringify({ message: `Nie znaleziono strony o adresie (slug): "${data.slugInput}" do zaktualizowania.` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = await auth.api.getSession(request);

    // Krok 2: Autoryzacja (zakładając, że Page ma pole creatorId)
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

    // Krok 3: Aktualizuj dokument używając jego unikalnego _id
    const result = await db.collection<Page>('pages').updateOne(
      { _id: new ObjectId(existingPage._id) }, // **Kluczowa zmiana: Filtruj po _id**
      {
        $set: {
          title: data.titleInput,
          content: data.content,
          updatedAt: new Date(),
          // WAŻNE: NIE aktualizuj 'slug' tutaj, chyba że świadomie na to pozwalasz.
          // Jeśli 'slugInput' z formularza miałby być nowym slugiem,
          // to logika musiałaby to obsłużyć inaczej (np. sprawdzić unikalność nowego sluga).
          // Obecnie UI blokuje edycję sluga, więc data.slugInput to stary slug.
        }
      }
      // Opcja { upsert: true } została usunięta. Domyślnie updateOne nie robi upsert.
    );

    if (result.matchedCount === 0) {
      // Ten błąd nie powinien wystąpić, jeśli existingPage został poprawnie znaleziony.
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