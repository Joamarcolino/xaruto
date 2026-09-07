import { AccountType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ROOT_ACCOUNTS: { type: AccountType; name: string }[] = [
  { type: "RECEITA", name: "RECEITAS" },
  { type: "DESPESA", name: "DESPESAS" },
  { type: "ATIVO", name: "ATIVO" },
  { type: "PASSIVO", name: "PASSIVO" },
  { type: "PATRIMONIO_LIQUIDO", name: "PATRIM. LÍQUIDO" },
];

export async function seedRootAccounts(
  tx: Prisma.TransactionClient,
  tenantId: string,
) {
  await tx.account.createMany({
    data: ROOT_ACCOUNTS.map((root, index) => ({
      tenantId,
      name: root.name,
      type: root.type,
      isRoot: true,
      isPinned: true,
      sortOrder: index,
    })),
  });
}

export async function getRootAccount(tenantId: string, type: AccountType) {
  return prisma.account.findFirstOrThrow({
    where: { tenantId, type, isRoot: true },
  });
}

export type AccountNode = {
  id: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  isPinned: boolean;
  isRoot: boolean;
  children: AccountNode[];
};

export async function getAccountTree(
  tenantId: string,
  type: AccountType,
): Promise<AccountNode> {
  const accounts = await prisma.account.findMany({
    where: { tenantId, type, isArchived: false },
    orderBy: [{ createdAt: "asc" }],
  });

  const byId = new Map<string, AccountNode>();
  for (const a of accounts) {
    byId.set(a.id, {
      id: a.id,
      name: a.name,
      type: a.type,
      parentId: a.parentId,
      isPinned: a.isPinned,
      isRoot: a.isRoot,
      children: [],
    });
  }

  let root: AccountNode | undefined;
  for (const a of accounts) {
    const node = byId.get(a.id)!;
    if (a.isRoot) {
      root = node;
      continue;
    }
    const parent = a.parentId ? byId.get(a.parentId) : undefined;
    parent?.children.push(node);
  }

  if (!root) {
    throw new Error(`Conta raiz do tipo ${type} não encontrada (tenant ${tenantId})`);
  }
  return root;
}

/** Contas "folha" (sem filhas, exceto a raiz) — únicas elegíveis para receber lançamentos. */
export async function listLeafAccounts(tenantId: string, types?: AccountType[]) {
  const accounts = await prisma.account.findMany({
    where: {
      tenantId,
      isArchived: false,
      ...(types ? { type: { in: types } } : {}),
    },
    orderBy: [{ type: "asc" }, { createdAt: "asc" }],
  });

  const parentIds = new Set(accounts.map((a) => a.parentId).filter(Boolean));
  return accounts.filter((a) => !a.isRoot && !parentIds.has(a.id));
}

/** Todas as contas não-raiz de um tipo, para popular o seletor "Pasta ou conta" no editor. */
export async function listAccountsForType(tenantId: string, type: AccountType) {
  return prisma.account.findMany({
    where: { tenantId, type, isArchived: false },
    orderBy: [{ createdAt: "asc" }],
  });
}

export async function createAccount(input: {
  tenantId: string;
  type: AccountType;
  name: string;
  parentId?: string | null;
  isPinned?: boolean;
}) {
  const parentId = input.parentId ?? (await getRootAccount(input.tenantId, input.type)).id;

  const parent = await prisma.account.findUniqueOrThrow({ where: { id: parentId } });
  if (parent.tenantId !== input.tenantId || parent.type !== input.type) {
    throw new Error("Pasta/conta pai inválida para esse tipo de conta");
  }

  return prisma.account.create({
    data: {
      tenantId: input.tenantId,
      type: input.type,
      name: input.name,
      parentId,
      isPinned: input.isPinned ?? false,
    },
  });
}

async function assertNoCycle(tenantId: string, accountId: string, newParentId: string) {
  if (newParentId === accountId) throw new Error("Uma conta não pode ser pai dela mesma");
  let cursor: string | null = newParentId;
  while (cursor) {
    if (cursor === accountId) throw new Error("Não é possível mover uma conta para dentro dela mesma");
    const node: { parentId: string | null } | null = await prisma.account.findUnique({
      where: { id: cursor },
      select: { parentId: true },
    });
    cursor = node?.parentId ?? null;
  }
}

export async function updateAccount(input: {
  tenantId: string;
  id: string;
  name: string;
  parentId: string;
}) {
  const account = await prisma.account.findUniqueOrThrow({ where: { id: input.id } });
  if (account.tenantId !== input.tenantId) throw new Error("Conta não encontrada");
  if (account.isRoot) throw new Error("A conta raiz não pode ser editada");

  const parent = await prisma.account.findUniqueOrThrow({ where: { id: input.parentId } });
  if (parent.tenantId !== input.tenantId || parent.type !== account.type) {
    throw new Error("Pasta/conta pai inválida para esse tipo de conta");
  }

  await assertNoCycle(input.tenantId, input.id, input.parentId);

  return prisma.account.update({
    where: { id: input.id },
    data: { name: input.name, parentId: input.parentId },
  });
}

export async function deleteAccount(input: { tenantId: string; id: string }) {
  const account = await prisma.account.findUniqueOrThrow({ where: { id: input.id } });
  if (account.tenantId !== input.tenantId) throw new Error("Conta não encontrada");
  if (account.isRoot || account.isPinned) throw new Error("Essa conta não pode ser apagada");

  const [childCount, transactionCount] = await Promise.all([
    prisma.account.count({ where: { parentId: input.id } }),
    prisma.transaction.count({
      where: { OR: [{ fromAccountId: input.id }, { toAccountId: input.id }] },
    }),
  ]);

  if (childCount > 0) throw new Error("Mova ou apague as contas filhas antes de apagar essa pasta");
  if (transactionCount > 0) throw new Error("Essa conta já tem lançamentos e não pode ser apagada");

  await prisma.account.delete({ where: { id: input.id } });
}
