import { prisma } from "@/lib/prisma";

/** Regra fixa do plano de contas: RECEITA só como origem, DESPESA só como destino. */
export async function assertValidAccountPair(
  tenantId: string,
  fromAccountId: string,
  toAccountId: string,
) {
  if (fromAccountId === toAccountId) {
    throw new Error("Origem e destino não podem ser a mesma conta");
  }

  const [fromAccount, toAccount] = await Promise.all([
    prisma.account.findUniqueOrThrow({ where: { id: fromAccountId } }),
    prisma.account.findUniqueOrThrow({ where: { id: toAccountId } }),
  ]);

  if (fromAccount.tenantId !== tenantId || toAccount.tenantId !== tenantId) {
    throw new Error("Conta não encontrada");
  }
  if (fromAccount.type === "DESPESA") {
    throw new Error("Uma conta de despesa não pode ser a origem de um lançamento");
  }
  if (toAccount.type === "RECEITA") {
    throw new Error("Uma conta de receita não pode ser o destino de um lançamento");
  }

  return { fromAccount, toAccount };
}
