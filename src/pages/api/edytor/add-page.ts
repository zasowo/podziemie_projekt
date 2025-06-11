// src/pages/api/edytor/add-page.ts
import type { APIRoute } from 'astro';
import { connectToDatabase, type Page } from '@/lib/pagedb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

// Interfejs danych oczekiwanych z formularza
interface PostData {
  content: object;       // Treść z edytora Tiptap
  titleInput: string;    // Tytuł strony
  slugInput: string;     // Slug strony
  regionSlug?: string | null; // Opcjonalny slug regionu
  organizationSlug?: string | null
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Pobranie sesji użytkownika
    const session = locals.session || await auth.api.getSession(request);

    // Zakładamy, że user info jest w session.user lub bezpośrednio w session (dostosuj do swojego auth)
    const user = (session as any).user || session;

    if (!user || (user.role !== "admin" && user.role !== "edytor")) {
      return new Response(
        JSON.stringify({ message: 'Brak uprawnień do dodania strony.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!user.id) {
        return new Response(
            JSON.stringify({ message: 'Błąd: Brak ID użytkownika w sesji.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    const creatorId = new ObjectId(user.id);

    const body = await request.json();
    const data: PostData = {
      content: body.content,
      titleInput: body.titleInput,
      slugInput: body.slugInput,
      regionSlug: body.regionSlug,
      organizationSlug: body.organizationSlug, 
    };

    // Walidacja podstawowych pól
    if (!data.content || !data.titleInput || !data.slugInput) {
      return new Response(
        JSON.stringify({ message: 'Brakujące pola formularza: treść, tytuł i slug są wymagane.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Normalizacja i walidacja sluga
    let normalizedSlug = data.slugInput.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
    // Zastąp polskie znaki i spacje, usuń nieodpowiednie znaki oprócz ukośników dla zagnieżdżenia
    normalizedSlug = normalizedSlug
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Usuń diakrytyki
        .replace(/ł/g, 'l').replace(/Ł/g, 'L') // Zamień ł, Ł na l, L
        .replace(/\s+/g, '-') // Zamień spacje na myślniki
        .replace(/[^a-z0-9-/_]/g, ''); // Usuń wszystkie znaki oprócz małych liter, cyfr, myślników i ukośników

    if (!normalizedSlug) {
        return new Response(
            JSON.stringify({ message: 'Slug nie może być pusty po normalizacji i musi zawierać dozwolone znaki.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
    // Zabezpieczone slug-i
    const protectedSlugs = ['404', 'admin', 'edytor', 'api', 'auth', 'lib', 'pages', 'styles', 'types', 'layouts', 'hooks', 'components', 'user', 'unauthorized', 'region', 'artykuly', 'images', 'fonts', 'public'];
    if (protectedSlugs.some(protectedSlug => normalizedSlug === protectedSlug || normalizedSlug.startsWith(protectedSlug + '/'))) {
      return new Response(
        JSON.stringify({ message: `Ten adres (slug) "${normalizedSlug}" jest zarezerwowany i nie może być użyty.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const db = await connectToDatabase();

    // Sprawdzenie, czy slug już istnieje
    const existingPageBySlug = await db.collection<Page>('pages').findOne({ slug: normalizedSlug });
    if (existingPageBySlug) {
      return new Response(
        JSON.stringify({ message: `Strona o adresie (slug) "${normalizedSlug}" już istnieje. Wybierz inny adres.` }),
        { status: 409, headers: { 'Content-Type': 'application/json' } } // 409 Conflict
      );
    }

    // Przygotowanie danych nowego dokumentu strony
    // Upewnij się, że typ Page w pagedb.ts odzwierciedla te pola
    const newPageData: Omit<Page, '_id'> = { 
      title: data.titleInput.trim(),
      slug: normalizedSlug,
      content: data.content,
      creatorId: creatorId, 
      createdAt: new Date(),
      updatedAt: new Date(), // Ustawiamy updatedAt na ten sam czas co createdAt
      regionSlug: data.regionSlug === "" ? null : (data.regionSlug || null), // Zapisz regionSlug lub null
      organizationSlug: data.organizationSlug || null,
      comments: [], // Inicjalizuj pustą tablicą komentarzy
    };

    const result = await db.collection('pages').insertOne(newPageData as Page); // MongoDB doda _id

    if (result.insertedId) {
      return new Response(
        JSON.stringify({ slug: normalizedSlug, message: "Strona dodana pomyślnie" }), 
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ message: "Nie udało się dodać strony do bazy danych." }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error: any) {
    console.error('Błąd podczas dodawania strony (API /api/edytor/add-page):', error);
    let errorMessage = 'Błąd API: ';
    if (error instanceof Error) {
        errorMessage += error.message;
    } else if (typeof error === 'string') {
        errorMessage += error;
    } else {
        errorMessage += 'Nieznany błąd serwera.';
    }
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: errorMessage }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};