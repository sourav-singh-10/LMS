import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// IMPORTANT: Parse and convert admin emails to a list of lowercase strings for reliable checking
const ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase()) 
  : [];

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
    // 1. SIGN IN CALLBACK (The Gatekeeper) -> Determines if the user is allowed to sign in
    async signIn({ user }) {
      if (user.email) {
        // lower case me change for comparison
        const userEmailLower = user.email.toLowerCase();
        
        if (ADMIN_EMAILS.includes(userEmailLower)) {
          console.log(`Admin Sign-In Allowed: ${userEmailLower}`);
          return true;
        }
      }
      
      console.log(`Sign-In Denied: ${user.email || 'No Email'}`);
      // block sign in
      return false;
    },

    // 2. SESSION CALLBACK - Adds the isAdmin flag to the session object
    async session({ session }) {
      if (session.user && session.user.email) {
        // Check for admin status 
        const userEmailLower = session.user.email.toLowerCase();
        session.user.isAdmin = ADMIN_EMAILS.includes(userEmailLower);
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };