import { RecurrenceFrequency } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { addDays, addMonths } from "@/lib/date-utils";
import { assertValidAccountPair } from "./validation";

function generateOccurrences(
  start: Date,
  frequency: RecurrenceFrequency,
  horizon: Date,
  end: Date | null,
): Date[] {
  const limit = end && end < horizon ? end : horizon;
  const dates: Date[] = [];
  let cursor = new Date(start);

  while (cursor <= limit) {
    dates.push(new Date(cursor));
    cursor =
      frequency === "WEEKLY"
        ? addDays(cursor, 7)
        : frequency === "MONTHLY"
          ? addMonths(cursor, 1)
          : addMonths(cursor, 12);
  }
  return dates;
}

export async function listRecurrenceRules(tenantId: string) {
  return prisma.recurrenceRule.findMany({
    where: { tenantId },
    include: { fromAccount: true, toAccount: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createRecurrenceRule(input: {
  tenantId: string;
  createdByUserId: string;
  description: string;
  amount: number;
  frequency: RecurrenceFrequency;
  fromAccountId: string;
  toAccountId: string;
  startDate: Date;
  endDate?: Date | null;
  horizonMonths?: number;
}) {
  await assertValidAccountPair(input.tenantId, input.fromAccountId, input.toAccountId);

  const horizonMonths = input.horizonMonths ?? 12;
  const horizonDate = addMonths(new Date(), horizonMonths);
  const occurrences = generateOccurrences(
    input.startDate,
    input.frequency,
    horizonDate,
    input.endDate ?? null,
  );

  return prisma.$transaction(async (tx) => {
    const rule = await tx.recurrenceRule.create({
      data: {
        tenantId: input.tenantId,
        createdByUserId: input.createdByUserId,
        description: input.description,
        amount: input.amount,
        frequency: input.frequency,
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        startDate: input.startDate,
        endDate: input.endDate ?? null,
        horizonMonths,
        lastGeneratedAt: new Date(),
      },
    });

    await tx.transaction.createMany({
      data: occurrences.map((date) => ({
        tenantId: input.tenantId,
        createdByUserId: input.createdByUserId,
        description: input.description,
        amount: input.amount,
        date,
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        status: "PENDING" as const,
        source: "RECURRING" as const,
        recurrenceRuleId: rule.id,
      })),
    });

    return rule;
  });
}

export async function deleteRecurrenceRule(input: { tenantId: string; id: string }) {
  const rule = await prisma.recurrenceRule.findUniqueOrThrow({ where: { id: input.id } });
  if (rule.tenantId !== input.tenantId) throw new Error("Recorrência não encontrada");

  await prisma.$transaction([
    prisma.transaction.deleteMany({
      where: { recurrenceRuleId: input.id, status: "PENDING" },
    }),
    prisma.recurrenceRule.delete({ where: { id: input.id } }),
  ]);
}

/** Estende a geração de todas as recorrências ativas até `horizonMonths` a partir de agora. Chamado pelo cron mensal. */
export async function extendAllRecurrences() {
  const rules = await prisma.recurrenceRule.findMany({
    where: { OR: [{ endDate: null }, { endDate: { gt: new Date() } }] },
  });

  let created = 0;
  for (const rule of rules) {
    const horizonDate = addMonths(new Date(), rule.horizonMonths);
    const lastTransaction = await prisma.transaction.findFirst({
      where: { recurrenceRuleId: rule.id },
      orderBy: { date: "desc" },
    });

    const nextStart = lastTransaction
      ? rule.frequency === "WEEKLY"
        ? addDays(lastTransaction.date, 7)
        : rule.frequency === "MONTHLY"
          ? addMonths(lastTransaction.date, 1)
          : addMonths(lastTransaction.date, 12)
      : rule.startDate;

    if (nextStart > horizonDate) continue;

    const occurrences = generateOccurrences(nextStart, rule.frequency, horizonDate, rule.endDate);
    if (occurrences.length === 0) continue;

    await prisma.$transaction([
      prisma.transaction.createMany({
        data: occurrences.map((date) => ({
          tenantId: rule.tenantId,
          createdByUserId: rule.createdByUserId,
          description: rule.description,
          amount: rule.amount,
          date,
          fromAccountId: rule.fromAccountId,
          toAccountId: rule.toAccountId,
          status: "PENDING" as const,
          source: "RECURRING" as const,
          recurrenceRuleId: rule.id,
        })),
      }),
      prisma.recurrenceRule.update({ where: { id: rule.id }, data: { lastGeneratedAt: new Date() } }),
    ]);
    created += occurrences.length;
  }

  return { rulesProcessed: rules.length, transactionsCreated: created };
}
