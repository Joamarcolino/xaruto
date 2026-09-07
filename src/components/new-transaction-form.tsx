"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  createTransactionAction,
  type TransactionFormState,
} from "@/server/actions/transaction-actions";

export type LeafAccountOption = { id: string; name: string; type: string };

export function NewTransactionForm({
  accounts,
  defaultDate,
}: {
  accounts: LeafAccountOption[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<TransactionFormState, FormData>(
    createTransactionAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state?.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mb-3 flex flex-wrap items-end gap-2 rounded-md border border-slate-200 p-3 text-sm dark:border-zinc-800"
    >
      <Field label="Descrição">
        <input
          name="description"
          required
          className="w-40 rounded border border-slate-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </Field>

      <Field label="Origem">
        <select
          name="fromAccountId"
          required
          className="w-40 rounded border border-slate-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Selecione</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Destino">
        <select
          name="toAccountId"
          required
          className="w-40 rounded border border-slate-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Selecione</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Valor">
        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          className="w-28 rounded border border-slate-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </Field>

      <Field label="Data">
        <input
          name="date"
          type="date"
          required
          defaultValue={defaultDate}
          className="rounded border border-slate-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </Field>

      <Field label="Status">
        <select
          name="status"
          defaultValue="PENDING"
          className="rounded border border-slate-300 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="PENDING">Pendente</option>
          <option value="CONFIRMED">Confirmado</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 font-medium text-white disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        {pending ? "Salvando..." : "+ Lançamento"}
      </button>

      {state?.error && (
        <p className="w-full text-sm text-rose-600 dark:text-rose-400" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-500">
      {label}
      {children}
    </label>
  );
}
