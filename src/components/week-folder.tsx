"use client";

import { useState } from "react";
import { formatCurrencyBRL } from "@/lib/period";
import { AccountTreeView } from "@/components/account-tree-view";
import { ACCENT_BAR } from "@/lib/account-colors";
import type { WeekBucket } from "@/server/reports/weekly";

export function WeekFolder({ week, defaultOpen }: { week: WeekBucket; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-slate-50 px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-slate-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/60"
      >
        <span className="flex items-center gap-2">
          <span className="text-amber-500">{open ? "📂" : "📁"}</span>
          Semana {week.label}
          {week.pendingCount > 0 && (
            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-zinc-700 dark:text-zinc-200">
              {week.pendingCount} pendente{week.pendingCount > 1 ? "s" : ""}
            </span>
          )}
        </span>
        <span className="flex gap-3 font-mono tabular-nums">
          <span className="text-emerald-600 dark:text-emerald-400">
            {formatCurrencyBRL(week.totalReceitas)}
          </span>
          <span className="text-rose-600 dark:text-rose-400">
            {formatCurrencyBRL(week.totalDespesas)}
          </span>
        </span>
      </button>

      {open && (
        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
          <AccountTreeView
            root={week.receitas}
            title="RECEITAS"
            editHref="/contas/receita/edit"
            accentClassName={ACCENT_BAR.RECEITA}
          />
          <AccountTreeView
            root={week.despesas}
            title="DESPESAS"
            editHref="/contas/despesa/edit"
            accentClassName={ACCENT_BAR.DESPESA}
          />
        </div>
      )}
    </div>
  );
}
