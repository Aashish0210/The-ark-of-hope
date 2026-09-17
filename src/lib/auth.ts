import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const DEFAULT_SECRET = "the-ark-of-hope-secret-key-production-development-auth-token-hash-2026";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@ark.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const email = credentials.email.trim().toLowerCase();

                let user = await prisma.user.findUnique({
                    where: { email }
                });

                // Auto-provision initial default admin if table is empty in production
                if (!user && email === "admin@ark.com") {
                    const defaultHashed = await bcrypt.hash("arkproject@2026", 10);
                    try {
                        user = await prisma.user.create({
                            data: {
                                email: "admin@ark.com",
                                password: defaultHashed
                            }
                        });
                    } catch (e) {
                        // In case of race condition or parallel request
                        user = await prisma.user.findUnique({ where: { email } });
                    }
                }

                if (!user) {
                    throw new Error("No user found");
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                };
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET || DEFAULT_SECRET,
};
