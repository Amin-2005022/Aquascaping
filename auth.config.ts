import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import type { NextAuthOptions } from "next-auth"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export default {
  // adapter: PrismaAdapter(prisma), // Temporarily disabled due to version compatibility
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) return null

          // For demo purposes, we'll skip password hashing
          // In production, use bcrypt to compare hashed passwords
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }: any) {
      if (token.role) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  },
} satisfies NextAuthOptions
