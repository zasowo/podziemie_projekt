import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

export const DELETE: APIRoute = async ({ request }) => {
    try {
        const { postId, commentId } = await request.json();
        console.log(postId);console.log(commentId);
        if (postId == null || commentId == null || postId == undefined || commentId == undefined) {
            return new Response(
                JSON.stringify({ message: 'Brakujące informacje' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        const session = await auth.api.getSession(request)
        if (session?.user.role == "admin") {
            const db = await connectToDatabase();

            const result = await db.collection('pages').updateOne(
                { _id: new ObjectId(postId) },
                {
                    $pull: {
                        comments: { _id: new ObjectId(commentId) }
                    }
                } as any
            );

            if (result.matchedCount === 0) {
                return new Response(
                    JSON.stringify({ error: 'Nie znaleziono wpisu' }),
                    {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            // Check if comment was actually removed
            if (result.modifiedCount === 0) {
                return new Response(
                    JSON.stringify({ error: 'Nie znaleziono komentarza' }),
                    {
                        status: 404,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            return new Response(
                JSON.stringify({
                    success: true,
                    message: 'Komentarz usunięty'
                }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } else {
            return new Response(
                JSON.stringify({ message: 'Brak uprawnień' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', message: 'API Error ' + (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
