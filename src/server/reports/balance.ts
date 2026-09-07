import { AccountType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAccountTree } from "@/server/data/accounts";
import { applyTotals, type AccountNodeWithTotal } from "./tree";
import { getMonthRange, type Period } from "@/lib/period";

export type BalanceResult = {
  ativo: AccountNodeWithTotal;
  passivo: AccountNodeWithTotal;
  patrimonioLiquido: AccountNodeWithTotal;
  totalAtivo: number;
  totalPassivo: number;
  totalPatrimonioLiquido: number;
};

/**
 * ATIVO é "débito-normal" (aumenta quando é destino de um lançamento).
 * PASSIVO e PATRIMONIO_LIQUIDO são "crédito-normal" (aumentam quando são origem),
 * o mesmo padrão contábil de RECEITA — o que fecha Ativo = Passivo + PL automaticamente.
 */
async function getBalanceMap(
  tenantId: string,
  type: AccountType,
  normalSide: "debit" | "credit",
  end: Date,
) {
  const accounts = await prisma.account.findMany({
    where: { tenantId, type, isArchived: false },
  });
  const ids = accounts.map((a) => a.id);
  if (ids.length === 0) return new Map<string, number>();

  const [toGroup, fromGroup] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["toAccountId"],
      where: { tenantId, date: { lt: end }, toAccountId: { in: ids } },
      _sum: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["fromAccountId"],
      where: { tenantId, date: { lt: end }, fromAccountId: { in: ids } },
      _sum: { amount: true },
    }),
  ]);

  const toMap = new Map(toGroup.map((g) => [g.toAccountId, Number(g._sum.amount ?? 0)]));
  const fromMap = new Map(fromGroup.map((g) => [g.fromAccountId, Number(g._sum.amount ?? 0)]));

  const balances = new Map<string, number>();
  for (const a of accounts) {
    const opening = Number(a.openingBalance);
    const to = toMap.get(a.id) ?? 0;
    const from = fromMap.get(a.id) ?? 0;
    balances.set(a.id, opening + (normalSide === "debit" ? to - from : from - to));
  }
  return balances;
}

async function getAccumulatedResult(tenantId: string, end: Date) {
  const [receitas, despesas] = await Promise.all([
    prisma.transaction.aggregate({
      where: { tenantId, date: { lt: end }, fromAccount: { type: "RECEITA" } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { tenantId, date: { lt: end }, toAccount: { type: "DESPESA" } },
      _sum: { amount: true },
    }),
  ]);
  return Number(receitas._sum.amount ?? 0) - Number(despesas._sum.amount ?? 0);
}

export async function getBalance(tenantId: string, period: Period): Promise<BalanceResult> {
  const { end } = getMonthRange(period);

  const [ativoTree, passivoTree, plTree, ativoMap, passivoMap, plMap, accumulatedResult, accumulatedAccounts] =
    await Promise.all([
      getAccountTree(tenantId, "ATIVO"),
      getAccountTree(tenantId, "PASSIVO"),
      getAccountTree(tenantId, "PATRIMONIO_LIQUIDO"),
      getBalanceMap(tenantId, "ATIVO", "debit", end),
      getBalanceMap(tenantId, "PASSIVO", "credit", end),
      getBalanceMap(tenantId, "PATRIMONIO_LIQUIDO", "credit", end),
      getAccumulatedResult(tenantId, end),
      prisma.account.findMany({
        where: { tenantId, type: "PATRIMONIO_LIQUIDO", isAccumulatedResult: true },
        select: { id: true },
      }),
    ]);

  for (const a of accumulatedAccounts) {
    plMap.set(a.id, accumulatedResult);
  }

  const ativo = applyTotals(ativoTree, ativoMap);
  const passivo = applyTotals(passivoTree, passivoMap);
  const patrimonioLiquido = applyTotals(plTree, plMap);

  return {
    ativo,
    passivo,
    patrimonioLiquido,
    totalAtivo: ativo.total,
    totalPassivo: passivo.total,
    totalPatrimonioLiquido: patrimonioLiquido.total,
  };
}
