import type { AccountNode } from "@/server/data/accounts";

export type FlatAccount = { id: string; name: string; depth: number; isPinned: boolean };

/** Achata a árvore (sem incluir a própria raiz) em uma lista indentada por profundidade. */
export function flattenAccountTree(node: AccountNode, depth = 0): FlatAccount[] {
  const self: FlatAccount[] = node.isRoot
    ? []
    : [{ id: node.id, name: node.name, depth, isPinned: node.isPinned }];
  const childDepth = node.isRoot ? depth : depth + 1;
  const children = node.children.flatMap((child) => flattenAccountTree(child, childDepth));
  return [...self, ...children];
}

/** Igual, mas inclui a própria raiz (depth 0) — usado para popular o seletor "Pasta ou conta". */
export function flattenIncludingRoot(node: AccountNode, depth = 0): FlatAccount[] {
  const self: FlatAccount[] = [{ id: node.id, name: node.name, depth, isPinned: node.isPinned }];
  const children = node.children.flatMap((child) => flattenIncludingRoot(child, depth + 1));
  return [...self, ...children];
}
