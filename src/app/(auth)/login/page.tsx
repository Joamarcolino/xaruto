"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginWithCredentials } from "@/server/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginWithCredentials, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
          Entrar
        </h1>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700 dark:text-zinc-300">E-mail</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-slate-700 dark:text-zinc-300">Senha</span>
          <input
            name="password"
            type="password"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>

        {state?.error && (
          <p className="text-sm text-rose-600 dark:text-rose-400" role="alert">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-md bg-emerald-700 hover:bg-emerald-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-slate-500">
        Ainda não tem conta?{" "}
        <Link href="/register" className="underline">
          Criar conta
        </Link>
      </p>
    </main>
  );
}
