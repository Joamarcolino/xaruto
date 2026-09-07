import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { SessionMembership } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.userId = user.id;
      }

      if (trigger === "update" && session?.activeTenantId) {
        token.activeTenantId = session.activeTenantId;
      }

      if (token.userId && (trigger === "signIn" || !token.memberships)) {
        const memberships = await prisma.membership.findMany({
          where: { userId: token.userId },
          include: { tenant: true },
          orderBy: { createdAt: "asc" },
        });

        token.memberships = memberships.map(
          (m): SessionMembership => ({
            tenantId: m.tenantId,
            tenantName: m.tenant.name,
            role: m.role,
          }),
        );

        if (!token.activeTenantId && memberships[0]) {
          token.activeTenantId = memberships[0].tenantId;
        }
      }

      return token;
    },
    async session({ session, token }) {
      const userId = token.userId as string | undefined;
      const memberships = token.memberships as SessionMembership[] | undefined;
      const activeTenantId = token.activeTenantId as string | null | undefined;

      if (userId && session.user) {
        session.user.id = userId;
      }
      session.memberships = memberships ?? [];
      session.activeTenantId = activeTenantId ?? null;
      return session;
    },
  },
});
