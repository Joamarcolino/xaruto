import Link from "next/link";
import { notFound } from "next/navigation";
import { requireActiveTenant } from "@/server/session";
import { getAccountTree } from "@/server/data/accounts";
import { prisma } from "@/lib/prisma";
import { typeFromSlug } from "@/lib/account-type-slug";
import { flattenAccountTree, flattenIncludingRoot } from "@/lib/account-tree-utils";
import { AccountModal } from "@/components/account-modal";

const TYPE_TITLES: Record<string, string> = {
  receita: "Receitas",
  despesa: "Despesas",
  ativo: "Ativo",
  passivo: "Passivo",
  patrimonio: "Patrimônio Líquido",
};

export default async function AccountEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ tipo: string }>;
  searchParams: Promise<{ new?: string; edit?: string }>;
}) {
  const { tipo } = await params;
  const search = await searchParams;

  let type;
  try {
    type = typeFromSlug(tipo);
  } catch {
    notFound();
  }

  const { tenantId } = await requireActiveTenant();
  const tree = await getAccountTree(tenantId, type);
  const flat = flattenAccountTree(tree);
  const parentOptions = flattenIncludingRoot(tree);
  const closeHref = `/contas/${tipo}/edit`;

  const editingAccount = search.edit
    ? await prisma.account.findFirst({ where: { id: search.edit, tenantId, type } })
    : null;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-zinc-800">
        <h1 className="text-sm font-semibold uppercase text-slate-700 dark:text-zinc-300">
          {TYPE_TITLES[tipo]}
        </h1>
        <Link href="/dashboard" className="text-xs text-slate-400 hover:underline">
          voltar
        </Link>
      </div>

      <ul className="flex flex-col">
        {flat.map((account) => (
          <li key={account.id}>
            <Link
              href={`${closeHref}?edit=${account.id}`}
              style={{ paddingLeft: `${account.depth * 16 + 8}px` }}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              <span>{account.name}</span>
              {account.isPinned && <span aria-label="fixado">📌</span>}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={`${closeHref}?new=1`}
        className="mt-4 inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        + Adicionar conta ou pasta
      </Link>

      {search.new && (
        <AccountModal mode="create" type={type} closeHref={closeHref} parentOptions={parentOptions} />
      )}

      {editingAccount && (
        <AccountModal
          mode="edit"
          type={type}
          closeHref={closeHref}
          parentOptions={parentOptions}
          account={{
            id: editingAccount.id,
            name: editingAccount.name,
            parentId: editingAccount.parentId ?? "",
            isAccumulatedResult: editingAccount.isAccumulatedResult,
          }}
        />
      )}
    </div>
  );
}
