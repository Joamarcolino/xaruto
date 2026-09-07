"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerTenant } from "@/server/actions/auth-actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerTenant, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
          Criar sua família/empresa
        </h1>
        <p className="text-sm text-slate-500">
          Isso cria um espaço financeiro isolado só seu.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <Field label="Nome da família/empresa" name="tenantName" placeholder="Edson & Karen" />
        <Field label="Seu nome" name="name" placeholder="Edson" />
        <Field label="E-mail" name="email" type="email" placeholder="voce@exemplo.com" />
        <Field label="Senha" name="password" type="password" placeholder="mínimo 8 caracteres" />

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
          {pending ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-slate-500">
        Já tem conta?{" "}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-700 dark:text-zinc-300">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
