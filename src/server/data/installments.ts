import { prisma } from "@/lib/prisma";
import { addMonths } from "@/lib/date-utils";
import { assertValidAccountPair } from "./validation";

export async function listInstallmentPlans(tenantId: string) {
  return prisma.installmentPlan.findMany({
    where: { tenantId },
    include: {
      fromAccount: true,
      toAccount: true,
      transactions: { orderBy: { installmentNumber: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createInstallmentPlan(input: {
  tenantId: string;
  createdByUserId: string;
  title: string;
  totalInstallments: number;
  amount: number;
  fromAccountId: string;
  toAccountId: string;
  startDate: Date;
}) {
  await assertValidAccountPair(input.tenantId, input.fromAccountId, input.toAccountId);

  const existingCount = await prisma.installmentPlan.count({ where: { tenantId: input.tenantId } });
  const code = `C${existingCount + 1}`;

  return prisma.$transaction(async (tx) => {
    const plan = await tx.installmentPlan.create({
      data: {
        tenantId: input.tenantId,
        code,
        title: input.title,
        totalInstallments: input.totalInstallments,
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        startDate: input.startDate,
      },
    });

    await tx.transaction.createMany({
      data: Array.from({ length: input.totalInstallments }, (_, i) => ({
        tenantId: input.tenantId,
        createdByUserId: input.createdByUserId,
        description: input.title,
        amount: input.amount,
        date: addMonths(input.startDate, i),
        fromAccountId: input.fromAccountId,
        toAccountId: input.toAccountId,
        status: "PENDING" as const,
        source: "INSTALLMENT" as const,
        installmentPlanId: plan.id,
        installmentNumber: i + 1,
        installmentTotal: input.totalInstallments,
      })),
    });

    return plan;
  });
}

export async function deleteInstallmentPlan(input: { tenantId: string; id: string }) {
  const plan = await prisma.installmentPlan.findUniqueOrThrow({
    where: { id: input.id },
    include: { transactions: true },
  });
  if (plan.tenantId !== input.tenantId) throw new Error("Carnê não encontrado");
  if (plan.transactions.some((t) => t.status === "CONFIRMED")) {
    throw new Error("Esse carnê já tem parcelas confirmadas e não pode ser apagado");
  }

  await prisma.$transaction([
    prisma.transaction.deleteMany({ where: { installmentPlanId: input.id } }),
    prisma.installmentPlan.delete({ where: { id: input.id } }),
  ]);
}
