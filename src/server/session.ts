import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireActiveTenant() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!session.activeTenantId) redirect("/login");

  return {
    userId: session.user.id,
    tenantId: session.activeTenantId,
    memberships: session.memberships,
  };
}
