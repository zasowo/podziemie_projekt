// src/env.d.ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: {
      id: string
      email: string
      name?: string
      role: string
    } | null
    role: string | null
    session: import ('better-auth').Session | null;
  }
}