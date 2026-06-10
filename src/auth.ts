import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./lib/prisma"
import bcrypt from "bcrypt"

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

        // Demo account bypass
        if (credentials.phoneOrCnic === "+971501234567" && credentials.password === "password123") {
          return {
            id: "demo-user-12345",
            name: "Demo User",
            phoneNumber: "+971501234567",
            cnic: "1234567890123",
            isEmailVerified: true,
            isPhoneVerified: true,
            isCnicVerified: true
          }
        }

        // Allow login with either Phone Number or CNIC
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { phoneNumber: credentials.phoneOrCnic as string },
              { cnic: credentials.phoneOrCnic as string },
              { email: credentials.phoneOrCnic as string }
            ]
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          cnic: user.cnic,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isCnicVerified: user.isCnicVerified
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
