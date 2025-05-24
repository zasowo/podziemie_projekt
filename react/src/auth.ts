// src/lib/auth.ts
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
    },
  },
  callbacks: {
    async signIn(user: any, request: any) {
      // Fetch role from database during sign in
      const userDoc = await db.collection("users").findOne({ 
        email: user.email 
      })
      
      // Return user with role
      return {
        user: {
          ...user,
          role: userDoc?.role || "user"
        }
      }
    },
  },
  trustedOrigins: ['https://podziemie.com.pl', 'http://localhost:4321']
})

export type Session = typeof auth.$Infer.Session