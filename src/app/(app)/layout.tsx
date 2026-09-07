import { Suspense } from "react";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { MonthYearNav } from "@/components/month-year-nav";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/lancamentos", label: "Lançamentos" },
  { href: "/lancamentos/repetidos", label: "Repetidos" },
  { href: "/semanal", label: "Semanal" },
  { href: "/bancos", label: "Bancos" },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const activeTenant = session?.memberships.find(
    (m) => m.tenantId === session.activeTenantId,
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="text-base font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
              xaruto
            </span>
            <Suspense>
              <MonthYearNav />
            </Suspense>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-xs leading-tight">
              <div className="font-medium text-slate-900 dark:text-zinc-50">
                {activeTenant?.tenantName}
              </div>
              <div className="text-slate-500">{session?.user?.name}</div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Sair
              </button>
            </form>
          </div>
        </div>

        <nav className="mx-auto flex max-w-[1400px] gap-4 px-4 pb-2 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-slate-500 transition-colors hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6">{children}</main>
    </div>
  );
}
