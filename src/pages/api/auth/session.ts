// src/pages/api/auth/session.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals, request }) => {

  const user = locals.user;

  if (user) {
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Brak aktywnej sesji' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};