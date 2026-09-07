/** Paleta semântica do design system: cada tipo contábil tem uma cor fixa. */
export const ACCENT_BAR: Record<string, string> = {
  RECEITA: "bg-emerald-600 dark:bg-emerald-600",
  DESPESA: "bg-rose-600 dark:bg-rose-600",
  ATIVO: "bg-sky-600 dark:bg-sky-600",
  PASSIVO: "bg-amber-600 dark:bg-amber-600",
  PATRIMONIO_LIQUIDO: "bg-violet-600 dark:bg-violet-600",
};

export const ACCOUNT_BADGE: Record<string, string> = {
  RECEITA: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
  DESPESA: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
  ATIVO: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50",
  PASSIVO: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
  PATRIMONIO_LIQUIDO: "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/50",
};
