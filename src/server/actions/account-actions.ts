"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AccountType } from "@prisma/client";
import { requireActiveTenant } from "@/server/session";
import { createAccount, updateAccount, deleteAccount } from "@/server/data/accounts";
import { prisma } from "@/lib/prisma";
import { slugFromType } from "@/lib/account-type-slug";

export type AccountFormState = { error?: string } | undefined;

const typeSchema = z.enum(["RECEITA", "DESPESA", "ATIVO", "PASSIVO", "PATRIMONIO_LIQUIDO"]);

const createSchema = z.object({
  type: typeSchema,
  name: z.string().min(1, "Informe o nome da conta"),
  parentId: z.string().optional(),
});

export async function createAccountAction(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const { tenantId } = await requireActiveTenant();

  const parsed = createSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    parentId: formData.get("parentId") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  try {
    await createAccount({
      tenantId,
      type: parsed.data.type as AccountType,
      name: parsed.data.name,
      parentId: parsed.data.parentId,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao criar conta" };
  }

  revalidatePath("/dashboard");
  redirect(`/contas/${slugFromType(parsed.data.type)}/edit`);
}

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Informe o nome da conta"),
  parentId: z.string().min(1, "Informe a pasta/conta pai"),
  isAccumulatedResult: z.coerce.boolean().optional(),
});

export async function updateAccountAction(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const { tenantId } = await requireActiveTenant();

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    parentId: formData.get("parentId"),
    isAccumulatedResult: formData.get("isAccumulatedResult") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  let typeForRedirect: AccountType;
  try {
    const account = await updateAccount({
      tenantId,
      id: parsed.data.id,
      name: parsed.data.name,
      parentId: parsed.data.parentId,
    });
    typeForRedirect = account.type;

    if (account.type === "PATRIMONIO_LIQUIDO") {
      if (parsed.data.isAccumulatedResult) {
        await prisma.$transaction([
          prisma.account.updateMany({
            where: { tenantId, type: "PATRIMONIO_LIQUIDO", NOT: { id: account.id } },
            data: { isAccumulatedResult: false },
          }),
          prisma.account.update({ where: { id: account.id }, data: { isAccumulatedResult: true } }),
        ]);
      } else {
        await prisma.account.update({
          where: { id: account.id },
          data: { isAccumulatedResult: false },
        });
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao editar conta" };
  }

  revalidatePath("/dashboard");
  redirect(`/contas/${slugFromType(typeForRedirect)}/edit`);
}

export async function deleteAccountAction(
  _prevState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const { tenantId } = await requireActiveTenant();
  const id = String(formData.get("id"));
  const type = String(formData.get("type"));

  try {
    await deleteAccount({ tenantId, id });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao apagar conta" };
  }

  revalidatePath("/dashboard");
  redirect(`/contas/${slugFromType(type)}/edit`);
}
