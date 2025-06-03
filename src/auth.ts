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
    expiresIn: 60 * 60 * 24 * 7, 
    updateAge: 60 * 60 * 24, 
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
      const userDoc = await db.collection("users").findOne({ 
        email: user.email 
      })
      
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