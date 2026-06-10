import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      isEmailVerified: boolean
      isPhoneVerified: boolean
      isCnicVerified: boolean
      phoneNumber: string
      cnic: string
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneOrCnic: { label: "Phone Number or CNIC", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phoneOrCnic || !credentials?.password) {
          return null
        }

        // DB BYPASSED ENTIRELY
        // Always return the demo user ID so it bypasses dashboard layout checks
        return {
          id: "demo-user-12345",
          name: credentials.phoneOrCnic as string,
          phoneNumber: credentials.phoneOrCnic as string,
          cnic: "1234567890123",
          isEmailVerified: true,
          isPhoneVerified: true,
          isCnicVerified: true
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const u = user as Record<string, unknown>
        token.phoneNumber = u.phoneNumber
        token.cnic = u.cnic
        token.isEmailVerified = u.isEmailVerified
        token.isPhoneVerified = u.isPhoneVerified
        token.isCnicVerified = u.isCnicVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.phoneNumber = token.phoneNumber as string
        session.user.cnic = token.cnic as string
        session.user.isEmailVerified = token.isEmailVerified as boolean
        session.user.isPhoneVerified = token.isPhoneVerified as boolean
        session.user.isCnicVerified = token.isCnicVerified as boolean
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/en/login"
  }
})
