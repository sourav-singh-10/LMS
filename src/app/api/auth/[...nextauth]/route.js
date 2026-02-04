import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const runtime = "nodejs"

const ADMIN_EMAILS =
  process.env.ADMIN_EMAILS
    ?.split(",")
    .map(e => e.trim().toLowerCase()) ?? []

// ✅ MUST export this
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],

  pages: {
    error: '/auth/error',
    signIn: '/auth/signin',
  },

  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const userEmailLower = user.email.toLowerCase()

        if (ADMIN_EMAILS.includes(userEmailLower)) {
          console.log(`Admin Sign-In Allowed: ${userEmailLower}`)
          return true
        }
      }

      console.log(`Sign-In Denied: ${user.email || 'No Email'}`)
      return false
    },

    async session({ session }) {
      if (session.user?.email) {
        const userEmailLower = session.user.email.toLowerCase()
        session.user.isAdmin = ADMIN_EMAILS.includes(userEmailLower)
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

// keep this below options
const handler = NextAuth(authOptions)

// ✅ required by App Router
export { handler as GET, handler as POST }
