import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInUser, signInAdmin } from "@/lib/auth";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "user-credentials",
      name: "User Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await signInUser(
          credentials.username,
          credentials.password
        );
        if (!user) return null;
        return { id: user.id, name: user.username, role: "user" };
      },
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const admin = await signInAdmin(
          credentials.username,
          credentials.password
        );
        if (!admin) return null;
        return { id: admin.id, name: admin.username, role: "admin" };
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/auth/sign-in-user",
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // di dev tetap false
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
