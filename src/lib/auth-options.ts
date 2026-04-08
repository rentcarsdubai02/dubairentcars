import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { randomUUID } from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
           throw new Error("Missing parameters");
        }

        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (user.status === 'blocked') {
          throw new Error("Your account has been suspended.");
        }

        if (!user.password) {
          throw new Error("Incorrect password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        const newSessionToken = randomUUID();
        user.sessionToken = newSessionToken;
        await user.save();

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          sessionToken: newSessionToken
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.sessionToken = (user as any).sessionToken;
      }

      if (token.id) {
        await connectToDatabase();
        const dbUser = await User.findById(token.id);
        // Si le jeton stocké en BDD est différent de celui du JWT (nouvelle connexion ailleurs)
        if (!dbUser || dbUser.status === 'blocked' || dbUser.sessionToken !== token.sessionToken) {
          return {}; // Invalide le jeton silencieusement
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.id) {
        return { ...session, user: null as any };
      }
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
