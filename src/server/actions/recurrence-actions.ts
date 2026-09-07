"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireActiveTenant } from "@/server/session";
import { createRecurrenceRule, deleteRecurrenceRule } from "@/server/data/recurrences";

export type RecurrenceFormState = { error?: string } | undefined;

const createSchema = z.object({
  description: z.string().min(1, "Informe a descrição"),
  amount: z.coerce.number().positive("O valor precisa ser maior que zero"),
  frequency: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
  startDate: z.string().min(1, "Informe a data de início"),
  endDate: z.string().optional(),
  fromAccountId: z.string().min(1, "Informe a conta de origem"),
  toAccountId: z.string().min(1, "Informe a conta de destino"),
});

export async function createRecurrenceRuleAction(
  _prevState: RecurrenceFormState,
  formData: FormData,
): Promise<RecurrenceFormState> {
  const { userId, tenantId } = await requireActiveTenant();

  const parsed = createSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    frequency: formData.get("frequency") ?? "MONTHLY",
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    fromAccountId: formData.get("fromAccountId"),
    toAccountId: formData.get("toAccountId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await createRecurrenceRule({
      tenantId,
      createdByUserId: userId,
      description: parsed.data.description,
      amount: parsed.data.amount,
      frequency: parsed.data.frequency,
      fromAccountId: parsed.data.fromAccountId,
      toAccountId: parsed.data.toAccountId,
      startDate: new Date(`${parsed.data.startDate}T12:00:00.000Z`),
      endDate: parsed.data.endDate ? new Date(`${parsed.data.endDate}T12:00:00.000Z`) : null,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar recorrência" };
  }

  revalidatePath("/lancamentos/repetidos");
  revalidatePath("/dashboard");
}

export async function deleteRecurrenceRuleAction(formData: FormData) {
  const { tenantId } = await requireActiveTenant();
  const id = String(formData.get("id"));
  await deleteRecurrenceRule({ tenantId, id });
  revalidatePath("/lancamentos/repetidos");
  revalidatePath("/dashboard");
}
