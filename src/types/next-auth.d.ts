import type { MembershipRole } from "@prisma/client";

export type SessionMembership = {
  tenantId: string;
  tenantName: string;
  role: MembershipRole;
};

declare module "next-auth" {
  interface Session {
    memberships: SessionMembership[];
    activeTenantId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    memberships?: SessionMembership[];
    activeTenantId?: string | null;
  }
}
