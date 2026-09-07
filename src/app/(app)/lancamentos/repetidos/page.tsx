import { requireActiveTenant } from "@/server/session";
import { listInstallmentPlans } from "@/server/data/installments";
import { listRecurrenceRules } from "@/server/data/recurrences";
import { listLeafAccounts } from "@/server/data/accounts";
import { formatCurrencyBRL } from "@/lib/period";
import { NewInstallmentForm } from "@/components/new-installment-form";
import { NewRecurrenceForm } from "@/components/new-recurrence-form";
import { deleteInstallmentPlanAction } from "@/server/actions/installment-actions";
import { deleteRecurrenceRuleAction } from "@/server/actions/recurrence-actions";

const FREQUENCY_LABELS: Record<string, string> = {
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  YEARLY: "Anual",
};

export default async function RepetidosPage() {
  const { tenantId } = await requireActiveTenant();

  const [plans, rules, leafAccounts] = await Promise.all([
    listInstallmentPlans(tenantId),
    listRecurrenceRules(tenantId),
    listLeafAccounts(tenantId),
  ]);

  const accountOptions = leafAccounts.map((a) => ({ id: a.id, name: a.name, type: a.type }));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-2 text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Carnês (parcelamentos)
        </h1>
        <NewInstallmentForm accounts={accountOptions} defaultDate={today} />

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-zinc-900/60 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">tipo</th>
                <th className="px-3 py-2">parc.</th>
                <th className="px-3 py-2">título</th>
                <th className="px-3 py-2">conta</th>
                <th className="px-3 py-2 text-right">valor da parcela</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                    Nenhum carnê cadastrado
                  </td>
                </tr>
              )}
              {plans.map((plan) => {
                const confirmedCount = plan.transactions.filter((t) => t.status === "CONFIRMED").length;
                const isEntrada = plan.fromAccount.type === "RECEITA";
                const amount = plan.transactions[0]?.amount ?? 0;
                return (
                  <tr key={plan.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-zinc-800 dark:hover:bg-zinc-800/40">
                    <td className="px-3 py-2">{isEntrada ? "⬆" : "⬇"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {confirmedCount}/{plan.totalInstallments}{" "}
                      <span className="text-xs text-slate-400">{plan.code}</span>
                    </td>
                    <td className="px-3 py-2">{plan.title}</td>
                    <td className="px-3 py-2">{plan.toAccount.name}</td>
                    <td className="px-3 py-2 text-right font-mono text-sm font-semibold tabular-nums whitespace-nowrap">
                      {formatCurrencyBRL(Number(amount))}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <form action={deleteInstallmentPlanAction}>
                        <input type="hidden" name="id" value={plan.id} />
                        <button type="submit" className="text-slate-300 hover:text-rose-600 dark:text-rose-400" title="Apagar">
                          ✕
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h1 className="mb-2 text-sm font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Lançamentos recorrentes
        </h1>
        <NewRecurrenceForm accounts={accountOptions} defaultDate={today} />

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-zinc-900/60 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">tipo</th>
                <th className="px-3 py-2">descrição</th>
                <th className="px-3 py-2">frequência</th>
                <th className="px-3 py-2">conta</th>
                <th className="px-3 py-2 text-right">valor</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rules.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                    Nenhuma recorrência cadastrada
                  </td>
                </tr>
              )}
              {rules.map((rule) => {
                const isEntrada = rule.fromAccount.type === "RECEITA";
                return (
                  <tr key={rule.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/80 dark:border-zinc-800 dark:hover:bg-zinc-800/40">
                    <td className="px-3 py-2">{isEntrada ? "⬆" : "⬇"}</td>
                    <td className="px-3 py-2">{rule.description}</td>
                    <td className="px-3 py-2">{FREQUENCY_LABELS[rule.frequency]}</td>
                    <td className="px-3 py-2">{rule.toAccount.name}</td>
                    <td className="px-3 py-2 text-right font-mono text-sm font-semibold tabular-nums whitespace-nowrap">
                      {formatCurrencyBRL(Number(rule.amount))}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <form action={deleteRecurrenceRuleAction}>
                        <input type="hidden" name="id" value={rule.id} />
                        <button type="submit" className="text-slate-300 hover:text-rose-600 dark:text-rose-400" title="Apagar">
                          ✕
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
