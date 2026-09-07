"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrencyBRL } from "@/lib/period";
import type { AccountNodeWithTotal } from "@/server/reports/tree";

export function AccountTreeView({
  root,
  title,
  editHref,
  accentClassName,
}: {
  root: AccountNodeWithTotal;
  title: string;
  editHref: string;
  accentClassName: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div
        className={`flex items-center justify-between px-3 py-2 font-mono text-xs font-semibold tracking-wider text-white uppercase ${accentClassName}`}
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <Link href={editHref} className="opacity-80 hover:opacity-100" aria-label="Editar plano de contas">
            ✎
          </Link>
        </div>
        <span className="font-mono text-sm tabular-nums normal-case">{formatCurrencyBRL(root.total)}</span>
      </div>

      <div className="flex flex-col py-1">
        {root.children.length === 0 && (
          <p className="px-3 py-2 text-xs text-slate-400 dark:text-zinc-500">Nenhuma conta cadastrada</p>
        )}
        {root.children.map((child) => (
          <AccountNodeRow key={child.id} node={child} depth={0} />
        ))}
      </div>
    </div>
  );
}

function AccountNodeRow({ node, depth }: { node: AccountNodeWithTotal; depth: number }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((o) => !o)}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
        className="flex w-full items-center justify-between px-3 py-1.5 text-left text-sm transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
      >
        <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
          {hasChildren ? <span className="text-amber-500">{open ? "📂" : "📁"}</span> : null}
          {node.name}
          {node.isPinned && <span aria-label="fixado">📌</span>}
        </span>
        <span className="font-mono text-sm tabular-nums text-slate-600 dark:text-zinc-400">
          {formatCurrencyBRL(node.total)}
        </span>
      </button>

      {hasChildren && open && (
        <div>
          {node.children.map((child) => (
            <AccountNodeRow key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
