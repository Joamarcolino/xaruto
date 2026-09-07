import { Prisma, TransactionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getMonthRange, type Period } from "@/lib/period";
import { assertValidAccountPair } from "./validation";

const PAGE_SIZE = 15;

export async function listTransactions(
  tenantId: string,
  options: { period: Period; search?: string; page?: number },
) {
  const { start, end } = getMonthRange(options.period);
  const page = options.page ?? 1;

  const where: Prisma.TransactionWhereInput = {
    tenantId,
    date: { gte: start, lt: end },
    ...(options.search
      ? { description: { contains: options.search, mode: "insensitive" } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { fromAccount: true, toAccount: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, hasMore: page * PAGE_SIZE < total };
}

export async function createTransaction(input: {
  tenantId: string;
  createdByUserId: string;
  description: string;
  amount: number;
  date: Date;
  fromAccountId: string;
  toAccountId: string;
  status: TransactionStatus;
}) {
  await assertValidAccountPair(input.tenantId, input.fromAccountId, input.toAccountId);

  return prisma.transaction.create({
    data: {
      tenantId: input.tenantId,
      createdByUserId: input.createdByUserId,
      description: input.description,
      amount: input.amount,
      date: input.date,
      fromAccountId: input.fromAccountId,
      toAccountId: input.toAccountId,
      status: input.status,
      confirmedAt: input.status === "CONFIRMED" ? new Date() : null,
    },
  });
}

export async function toggleTransactionStatus(input: { tenantId: string; id: string }) {
  const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id: input.id } });
  if (transaction.tenantId !== input.tenantId) throw new Error("Lançamento não encontrado");

  const nextStatus: TransactionStatus =
    transaction.status === "CONFIRMED" ? "PENDING" : "CONFIRMED";

  return prisma.transaction.update({
    where: { id: input.id },
    data: { status: nextStatus, confirmedAt: nextStatus === "CONFIRMED" ? new Date() : null },
  });
}

export async function deleteTransaction(input: { tenantId: string; id: string }) {
  const transaction = await prisma.transaction.findUniqueOrThrow({ where: { id: input.id } });
  if (transaction.tenantId !== input.tenantId) throw new Error("Lançamento não encontrado");
  await prisma.transaction.delete({ where: { id: input.id } });
}
