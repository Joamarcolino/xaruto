import { prisma } from "@/lib/prisma";
import { getAccountTree } from "@/server/data/accounts";
import { applyTotals, type AccountNodeWithTotal } from "./tree";
import { getMonthRange, type Period } from "@/lib/period";

export type DreResult = {
  receitas: AccountNodeWithTotal;
  despesas: AccountNodeWithTotal;
  totalReceitas: number;
  totalDespesas: number;
  resultado: number;
};

export async function getDRE(tenantId: string, period: Period): Promise<DreResult> {
  const { start, end } = getMonthRange(period);

  const [receitasTree, despesasTree, receitasGroup, despesasGroup] = await Promise.all([
    getAccountTree(tenantId, "RECEITA"),
    getAccountTree(tenantId, "DESPESA"),
    prisma.transaction.groupBy({
      by: ["fromAccountId"],
      where: { tenantId, date: { gte: start, lt: end }, fromAccount: { type: "RECEITA" } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["toAccountId"],
      where: { tenantId, date: { gte: start, lt: end }, toAccount: { type: "DESPESA" } },
      _sum: { amount: true },
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
    receitas,
    despesas,
    totalReceitas: receitas.total,
    totalDespesas: despesas.total,
    resultado: receitas.total - despesas.total,
  };
}
