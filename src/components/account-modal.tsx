"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  createAccountAction,
  updateAccountAction,
  deleteAccountAction,
  type AccountFormState,
} from "@/server/actions/account-actions";
import type { AccountType } from "@prisma/client";

export type ParentOption = { id: string; name: string; depth: number };

type Props =
  | {
      mode: "create";
      type: AccountType;
      closeHref: string;
      parentOptions: ParentOption[];
    }
  | {
      mode: "edit";
      type: AccountType;
      closeHref: string;
      parentOptions: ParentOption[];
      account: { id: string; name: string; parentId: string; isAccumulatedResult: boolean };
    };

export function AccountModal(props: Props) {
  const router = useRouter();
  const [createState, createFormAction, createPending] = useActionState<AccountFormState, FormData>(
    createAccountAction,
    undefined,
  );
  const [updateState, updateFormAction, updatePending] = useActionState<AccountFormState, FormData>(
    updateAccountAction,
    undefined,
  );
  const [deleteState, deleteFormAction, deletePending] = useActionState<AccountFormState, FormData>(
    deleteAccountAction,
    undefined,
  );

  const isEdit = props.mode === "edit";
  const state = isEdit ? updateState : createState;
  const pending = isEdit ? updatePending : createPending;

  function close() {
    router.push(props.closeHref);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-50">Conta</h2>
          <button
            type="button"
            onClick={close}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <form action={isEdit ? updateFormAction : createFormAction} className="flex flex-col gap-3">
          {isEdit && <input type="hidden" name="id" value={props.account.id} />}
          <input type="hidden" name="type" value={props.type} />

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700 dark:text-zinc-300">Nome da Conta</span>
            <input
              name="name"
              defaultValue={isEdit ? props.account.name : ""}
              required
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700 dark:text-zinc-300">Pasta ou conta</span>
            <select
              name="parentId"
              defaultValue={isEdit ? props.account.parentId : ""}
              className="rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            >
              {!isEdit && <option value="">Conta (nível principal)</option>}
              {props.parentOptions
                .filter((opt) => !isEdit || opt.id !== props.account.id)
                .map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {"— ".repeat(opt.depth)}
                    {opt.name}
                  </option>
                ))}
            </select>
          </label>

          {isEdit && props.type === "PATRIMONIO_LIQUIDO" && (
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-zinc-300">
              <input
                type="checkbox"
                name="isAccumulatedResult"
                defaultChecked={props.account.isAccumulatedResult}
              />
              Resultado acumulado (calculado automaticamente como Receitas − Despesas)
            </label>
          )}

          {state?.error && (
            <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
              {state.error}
            </p>
          )}
          {deleteState?.error && (
            <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
              {deleteState.error}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              fechar
            </button>

            <div className="flex gap-2">
              {isEdit && (
                <button
                  type="submit"
                  formAction={deleteFormAction}
                  disabled={deletePending}
                  className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400"
                >
                  apagar
                </button>
              )}
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-emerald-700 hover:bg-emerald-800 px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                {pending ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
