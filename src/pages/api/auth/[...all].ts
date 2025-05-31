// src/pages/api/auth/[...all].ts
import { auth } from "../../../auth"; // Assuming src/auth.ts is the location
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
    return auth.handler(ctx.request);
};