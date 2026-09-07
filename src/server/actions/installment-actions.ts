"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireActiveTenant } from "@/server/session";
import { createInstallmentPlan, deleteInstallmentPlan } from "@/server/data/installments";

export type InstallmentFormState = { error?: string } | undefined;

const createSchema = z.object({
  title: z.string().min(1, "Informe o título"),
  totalInstallments: z.coerce.number().int().min(2, "Mínimo de 2 parcelas"),
  amount: z.coerce.number().positive("O valor precisa ser maior que zero"),
  startDate: z.string().min(1, "Informe a data da 1ª parcela"),
  fromAccountId: z.string().min(1, "Informe a conta de origem"),
  toAccountId: z.string().min(1, "Informe a conta de destino"),
});

export async function createInstallmentPlanAction(
  _prevState: InstallmentFormState,
  formData: FormData,
): Promise<InstallmentFormState> {
  const { userId, tenantId } = await requireActiveTenant();

  const parsed = createSchema.safeParse({
    title: formData.get("title"),
    totalInstallments: formData.get("totalInstallments"),
    amount: formData.get("amount"),
    startDate: formData.get("startDate"),
    fromAccountId: formData.get("fromAccountId"),
    toAccountId: formData.get("toAccountId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await createInstallmentPlan({
      tenantId,
      createdByUserId: userId,
      title: parsed.data.title,
      totalInstallments: parsed.data.totalInstallments,
      amount: parsed.data.amount,
      fromAccountId: parsed.data.fromAccountId,
      toAccountId: parsed.data.toAccountId,
      startDate: new Date(`${parsed.data.startDate}T12:00:00.000Z`),
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar carnê" };
  }

  revalidatePath("/lancamentos/repetidos");
  revalidatePath("/dashboard");
}

export async function deleteInstallmentPlanAction(formData: FormData) {
  const { tenantId } = await requireActiveTenant();
  const id = String(formData.get("id"));
  await deleteInstallmentPlan({ tenantId, id });
  revalidatePath("/lancamentos/repetidos");
  revalidatePath("/dashboard");
}
