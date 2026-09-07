import type { AccountNode } from "@/server/data/accounts";

export type AccountNodeWithTotal = Omit<AccountNode, "children"> & {
  total: number;
  children: AccountNodeWithTotal[];
};

/**
 * Soma o valor de cada nó-folha (via leafAmounts) com os totais dos filhos,
 * recursivamente, para que pastas colapsadas mostrem o total agregado.
 */
export function applyTotals(
  node: AccountNode,
  leafAmounts: Map<string, number>,
): AccountNodeWithTotal {
  const children = node.children.map((child) => applyTotals(child, leafAmounts));
  const ownAmount = leafAmounts.get(node.id) ?? 0;
  const total = ownAmount + children.reduce((sum, child) => sum + child.total, 0);
  return { ...node, children, total };
}
