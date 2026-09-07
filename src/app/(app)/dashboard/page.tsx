import { requireActiveTenant } from "@/server/session";
import { getDRE } from "@/server/reports/dre";
import { getBalance } from "@/server/reports/balance";
import { listTransactions } from "@/server/data/transactions";
import { listLeafAccounts } from "@/server/data/accounts";
import { getSelectedPeriod, formatCurrencyBRL, formatDateRangeLabel, MONTH_LABELS } from "@/lib/period";
import { AccountTreeView } from "@/components/account-tree-view";
import { TransactionsTable } from "@/components/transactions-table";
import { NewTransactionForm } from "@/components/new-transaction-form";
import { ACCENT_BAR } from "@/lib/account-colors";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const { tenantId } = await requireActiveTenant();
  const period = getSelectedPeriod(params);
  const page = Number(params.page ?? 1);

  const [dre, balance, transactions, leafAccounts] = await Promise.all([
    getDRE(tenantId, period),
    getBalance(tenantId, period),
    listTransactions(tenantId, { period, search: params.search, page }),
    listLeafAccounts(tenantId),
  ]);

  const accountOptions = leafAccounts.map((a) => ({ id: a.id, name: a.name, type: a.type }));
  const today = new Date().toISOString().slice(0, 10);
  const buildPageHref = (p: number) =>
    `/dashboard?month=${period.month}&year=${period.year}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}&page=${p}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between font-mono text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-zinc-400">
            <span>DRE · {formatDateRangeLabel(period)}</span>
            <span
              className={`tabular-nums ${dre.resultado >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
            >
              {formatCurrencyBRL(dre.resultado)}
            </span>
          </div>
          <AccountTreeView
            root={dre.receitas}
            title="RECEITAS"
            editHref="/contas/receita/edit"
            accentClassName={ACCENT_BAR.RECEITA}
          />
          <AccountTreeView
            root={dre.despesas}
            title="DESPESAS"
            editHref="/contas/despesa/edit"
            accentClassName={ACCENT_BAR.DESPESA}
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-mono text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-zinc-400">
            BALANÇO PATRIMONIAL · {MONTH_LABELS[period.month - 1]}/{period.year}
          </div>
          <AccountTreeView
            root={balance.ativo}
            title="ATIVO"
            editHref="/contas/ativo/edit"
            accentClassName={ACCENT_BAR.ATIVO}
          />
          <AccountTreeView
            root={balance.passivo}
            title="PASSIVO"
            editHref="/contas/passivo/edit"
            accentClassName={ACCENT_BAR.PASSIVO}
          />
          <AccountTreeView
            root={balance.patrimonioLiquido}
            title="PATRIM. LÍQUIDO"
            editHref="/contas/patrimonio/edit"
            accentClassName={ACCENT_BAR.PATRIMONIO_LIQUIDO}
          />
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
          Lançamentos do período
        </h2>
        <NewTransactionForm accounts={accountOptions} defaultDate={today} />

        <form method="get" className="mb-2 flex gap-2">
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
      </section>
    </div>
  );
}
