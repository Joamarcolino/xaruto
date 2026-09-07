import { formatCurrencyBRL } from "@/lib/period";
import {
  toggleTransactionStatusAction,
  deleteTransactionAction,
} from "@/server/actions/transaction-actions";
import { ACCOUNT_BADGE } from "@/lib/account-colors";
import type { Prisma } from "@prisma/client";

type TransactionWithAccounts = Prisma.TransactionGetPayload<{
  include: { fromAccount: true; toAccount: true };
}>;

function AccountBadge({ name, type }: { name: string; type: string }) {
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wide ${ACCOUNT_BADGE[type] ?? ""}`}
    >
      {name}
    </span>
  );
}

export function TransactionsTable({
  items,
  buildPageHref,
  page,
  hasMore,
}: {
  items: TransactionWithAccounts[];
  buildPageHref: (page: number) => string;
  page: number;
  hasMore: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-zinc-900/60 dark:text-zinc-400">
          <tr>
            <th className="px-3 py-2">data</th>
            <th className="px-3 py-2">descrição</th>
            <th className="px-3 py-2">origem &gt; destino</th>
            <th className="px-3 py-2 text-right">valor</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                Nenhum lançamento neste período
              </td>
            </tr>
          )}
          {items.map((tx) => (
            <tr
              key={tx.id}
              className="border-t border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-zinc-800 dark:hover:bg-zinc-800/40"
            >
              <td className="px-3 py-2 font-mono text-xs tabular-nums whitespace-nowrap text-slate-500 dark:text-zinc-400">
                {new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(tx.date)}
              </td>
              <td className="px-3 py-2">
                {tx.description}
                {(tx.source === "RECURRING" || tx.source === "INSTALLMENT") && (
                  <span className="ml-1 text-slate-400" title="Lançamento recorrente/parcelado">
                    ↻
                  </span>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <AccountBadge name={tx.fromAccount.name} type={tx.fromAccount.type} /> {"›"}{" "}
                <AccountBadge name={tx.toAccount.name} type={tx.toAccount.type} />
              </td>
              <td className="px-3 py-2 text-right font-mono text-sm font-semibold tabular-nums whitespace-nowrap text-slate-900 dark:text-zinc-100">
                {formatCurrencyBRL(Number(tx.amount))}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <form action={toggleTransactionStatusAction}>
                    <input type="hidden" name="id" value={tx.id} />
                    <button
                      type="submit"
                      title={tx.status === "CONFIRMED" ? "Confirmado — marcar como pendente" : "Marcar como confirmado"}
                      className={tx.status === "CONFIRMED" ? "text-emerald-600" : "text-slate-300 dark:text-zinc-600"}
                    >
                      ✓
                    </button>
                  </form>
                  <form action={deleteTransactionAction}>
                    <input type="hidden" name="id" value={tx.id} />
                    <button
                      type="submit"
                      className="text-slate-300 hover:text-rose-600 dark:text-zinc-600 dark:hover:text-rose-400"
                      title="Apagar"
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasMore && (
        <div className="border-t border-slate-100 p-2 text-center dark:border-zinc-800">
          <a href={buildPageHref(page + 1)} className="text-xs text-slate-500 hover:underline dark:text-zinc-400">
            ⌄ Ver mais
          </a>
        </div>
      )}
    </div>
  );
}
