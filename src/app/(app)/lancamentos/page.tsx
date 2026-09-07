import { requireActiveTenant } from "@/server/session";
import { listTransactions } from "@/server/data/transactions";
import { listLeafAccounts } from "@/server/data/accounts";
import { getSelectedPeriod, formatDateRangeLabel } from "@/lib/period";
import { TransactionsTable } from "@/components/transactions-table";
import { NewTransactionForm } from "@/components/new-transaction-form";

export default async function LancamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { tenantId } = await requireActiveTenant();
  const period = getSelectedPeriod(params);
  const page = Number(params.page ?? 1);

  const [transactions, leafAccounts] = await Promise.all([
    listTransactions(tenantId, { period, search: params.search, page }),
    listLeafAccounts(tenantId),
  ]);

  const accountOptions = leafAccounts.map((a) => ({ id: a.id, name: a.name, type: a.type }));
  const today = new Date().toISOString().slice(0, 10);
  const buildPageHref = (p: number) =>
    `/lancamentos?month=${period.month}&year=${period.year}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}&page=${p}`;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
        Lançamentos · {formatDateRangeLabel(period)}
      </h1>

      <NewTransactionForm accounts={accountOptions} defaultDate={today} />

      <form method="get" className="flex gap-2">
        <input type="hidden" name="month" value={period.month} />
        <input type="hidden" name="year" value={period.year} />
        <input
          type="text"
          name="search"
          defaultValue={params.search}
          placeholder="Buscar lançamentos"
          className="w-full max-w-xs rounded border border-slate-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </form>

      <TransactionsTable
        items={transactions.items}
        buildPageHref={buildPageHref}
        page={transactions.page}
        hasMore={transactions.hasMore}
      />
    </div>
  );
}
