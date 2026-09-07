"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MONTH_LABELS, getSelectedPeriod } from "@/lib/period";

export function MonthYearNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { month, year } = getSelectedPeriod({
    month: searchParams.get("month") ?? undefined,
    year: searchParams.get("year") ?? undefined,
  });

  function navigate(nextMonth: number, nextYear: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", String(nextMonth));
    params.set("year", String(nextYear));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <button
        type="button"
        onClick={() => navigate(month === 1 ? 12 : month - 1, month === 1 ? year - 1 : year)}
        className="rounded px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
        aria-label="Mês anterior"
      >
        ‹
      </button>

      <div className="flex gap-1">
        {MONTH_LABELS.map((label, index) => {
          const isActive = index + 1 === month;
          return (
            <button
              key={label}
              type="button"
              onClick={() => navigate(index + 1, year)}
              className={`rounded-md px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wide uppercase ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => navigate(month === 12 ? 1 : month + 1, month === 12 ? year + 1 : year)}
        className="rounded px-1.5 py-0.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
        aria-label="Próximo mês"
      >
        ›
      </button>

      <select
        value={year}
        onChange={(e) => navigate(month, Number(e.target.value))}
        className="rounded border border-slate-300 bg-transparent px-1 py-0.5 text-sm dark:border-zinc-700"
      >
        {Array.from({ length: 7 }, (_, i) => year - 3 + i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
