import { withAuth } from "next-auth/middleware";

const DEFAULT_SECRET = "the-ark-of-hope-secret-key-production-development-auth-token-hash-2026";

export default withAuth({
    pages: {
        signIn: "/admin/login",
        error: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET || DEFAULT_SECRET,
});

export const config = {
    matcher: [
        "/admin",
        "/admin/((?!login).*)",
    ],
};
