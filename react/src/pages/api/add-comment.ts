import type { APIRoute } from 'astro';
import { connectToDatabase } from '@/lib/pagedb';
import { ObjectId } from 'mongodb';
import { auth } from '@/auth';

export const POST: APIRoute = async ({ request }) => {
    try {
        const { postId, comment } = await request.json();
        if (postId == null || comment == null || postId == undefined || comment == undefined) {
            //console.log(postId);console.log(comment);
            return new Response(
                JSON.stringify({ message: 'Brakujące informacje' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        if (typeof comment !== 'string' || comment.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Komentarz nie może być pusty' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        if (comment.trim().length > 3000) {
            return new Response(
                JSON.stringify({ error: 'Komentarz jest zbyt długi' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        const session = await auth.api.getSession(request)
        if (!session?.user.id) {
            return new Response(
                JSON.stringify({ message: 'Brak informacji o użytkowniku / logowania' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
        // Create the new comment object
        const newComment = {
            _id: new ObjectId(),
            userId: new ObjectId(session.user.id),
            name: session.user.name,
            comment: comment.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const db = await connectToDatabase();


        const result = await db.collection('pages').updateOne(
            { _id: new ObjectId(postId) },
            {
                $push: {
                    comments: newComment
                }
            } as any
        );

        // Check if post was found
        if (result.matchedCount === 0) {
            return new Response(
                JSON.stringify({ error: 'Strona nie została znaleziona' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Check if comment was actually added
        if (result.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ error: 'Nie udało się dodać komentarza' }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Komentarz dodany',
                comment: newComment
            }),
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error('Error occurred:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', message: 'API Error ' + (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
