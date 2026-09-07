import { prisma } from "@/lib/prisma";
import { getAccountTree } from "@/server/data/accounts";
import { applyTotals, type AccountNodeWithTotal } from "./tree";
import { getMonthRange, type Period } from "@/lib/period";
import { addDays } from "@/lib/date-utils";

export type WeekBucket = {
  label: string;
  start: Date;
  end: Date;
  receitas: AccountNodeWithTotal;
  despesas: AccountNodeWithTotal;
  totalReceitas: number;
  totalDespesas: number;
  pendingCount: number;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getWeekRanges(period: Period): { start: Date; end: Date; label: string }[] {
  const { start: monthStart, end: monthEnd } = getMonthRange(period);
  const buckets: { start: Date; end: Date; label: string }[] = [];
  let cursor = new Date(monthStart);

  while (cursor < monthEnd) {
    const bucketEnd = new Date(Math.min(addDays(cursor, 7).getTime(), monthEnd.getTime()));
    const lastDay = new Date(bucketEnd.getTime() - 24 * 60 * 60 * 1000);
    buckets.push({
      start: new Date(cursor),
      end: bucketEnd,
      label: `${pad(cursor.getUTCDate())}–${pad(lastDay.getUTCDate())}`,
    });
    cursor = bucketEnd;
  }
  return buckets;
}

export async function getWeeklyBreakdown(
  tenantId: string,
  period: Period,
  onlyPending: boolean,
): Promise<WeekBucket[]> {
  const ranges = getWeekRanges(period);
  const [receitasTree, despesasTree] = await Promise.all([
    getAccountTree(tenantId, "RECEITA"),
    getAccountTree(tenantId, "DESPESA"),
  ]);

  return Promise.all(
    ranges.map(async (range) => {
      const statusFilter = onlyPending ? ({ status: "PENDING" as const }) : {};

      const [receitasGroup, despesasGroup, pendingCount] = await Promise.all([
        prisma.transaction.groupBy({
          by: ["fromAccountId"],
          where: {
            tenantId,
            date: { gte: range.start, lt: range.end },
            fromAccount: { type: "RECEITA" },
            ...statusFilter,
          },
          _sum: { amount: true },
        }),
        prisma.transaction.groupBy({
          by: ["toAccountId"],
          where: {
            tenantId,
            date: { gte: range.start, lt: range.end },
            toAccount: { type: "DESPESA" },
            ...statusFilter,
          },
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: { tenantId, date: { gte: range.start, lt: range.end }, status: "PENDING" },
        }),
      ]);

      const receitasMap = new Map(
        receitasGroup.map((g) => [g.fromAccountId, Number(g._sum.amount ?? 0)]),
      );
      const despesasMap = new Map(
        despesasGroup.map((g) => [g.toAccountId, Number(g._sum.amount ?? 0)]),
      );

      const receitas = applyTotals(receitasTree, receitasMap);
      const despesas = applyTotals(despesasTree, despesasMap);

      return {
        label: range.label,
        start: range.start,
        end: range.end,
        receitas,
        despesas,
        totalReceitas: receitas.total,
        totalDespesas: despesas.total,
        pendingCount,
      };
    }),
  );
}
