"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireActiveTenant } from "@/server/session";
import {
  createTransaction,
  deleteTransaction,
  toggleTransactionStatus,
} from "@/server/data/transactions";

export type TransactionFormState = { error?: string } | undefined;

const createSchema = z.object({
  description: z.string().min(1, "Informe a descrição"),
  amount: z.coerce.number().positive("O valor precisa ser maior que zero"),
  date: z.string().min(1, "Informe a data"),
  fromAccountId: z.string().min(1, "Informe a conta de origem"),
  toAccountId: z.string().min(1, "Informe a conta de destino"),
  status: z.enum(["PENDING", "CONFIRMED"]),
});

export async function createTransactionAction(
  _prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const { userId, tenantId } = await requireActiveTenant();

  const parsed = createSchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    fromAccountId: formData.get("fromAccountId"),
    toAccountId: formData.get("toAccountId"),
    status: formData.get("status") ?? "PENDING",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await createTransaction({
      tenantId,
      createdByUserId: userId,
      description: parsed.data.description,
      amount: parsed.data.amount,
      date: new Date(`${parsed.data.date}T12:00:00.000Z`),
      fromAccountId: parsed.data.fromAccountId,
      toAccountId: parsed.data.toAccountId,
      status: parsed.data.status,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar lançamento" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
}

export async function toggleTransactionStatusAction(formData: FormData) {
  const { tenantId } = await requireActiveTenant();
  const id = String(formData.get("id"));
  await toggleTransactionStatus({ tenantId, id });
  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
}

export async function deleteTransactionAction(formData: FormData) {
  const { tenantId } = await requireActiveTenant();
  const id = String(formData.get("id"));
  await deleteTransaction({ tenantId, id });
  revalidatePath("/dashboard");
  revalidatePath("/lancamentos");
}
