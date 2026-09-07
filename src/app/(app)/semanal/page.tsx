import Link from "next/link";
import { requireActiveTenant } from "@/server/session";
import { getWeeklyBreakdown } from "@/server/reports/weekly";
import { getSelectedPeriod, formatDateRangeLabel } from "@/lib/period";
import { WeekFolder } from "@/components/week-folder";

export default async function SemanalPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; all?: string }>;
}) {
  const params = await searchParams;
  const { tenantId } = await requireActiveTenant();
  const period = getSelectedPeriod(params);
  const showAll = params.all === "1";

  const weeks = await getWeeklyBreakdown(tenantId, period, !showAll);

  const toggleHref = `/semanal?month=${period.month}&year=${period.year}${showAll ? "" : "&all=1"}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Contas por semana · {formatDateRangeLabel(period)}
        </h1>
        <Link href={toggleHref} className="text-xs text-slate-500 hover:underline">
          {showAll ? "mostrar só pendentes" : "mostrar também confirmados"}
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {weeks.map((week, index) => (
          <WeekFolder key={week.label} week={week} defaultOpen={index === 0} />
        ))}
      </div>
    </div>
  );
}
