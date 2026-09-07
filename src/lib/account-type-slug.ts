import type { AccountType } from "@prisma/client";

export function slugFromType(type: string) {
  return (
    {
      RECEITA: "receita",
      DESPESA: "despesa",
      ATIVO: "ativo",
      PASSIVO: "passivo",
      PATRIMONIO_LIQUIDO: "patrimonio",
    } as Record<string, string>
  )[type];
}

export function typeFromSlug(slug: string): AccountType {
  const map: Record<string, AccountType> = {
    receita: "RECEITA",
    despesa: "DESPESA",
    ativo: "ATIVO",
    passivo: "PASSIVO",
    patrimonio: "PATRIMONIO_LIQUIDO",
  };
  const type = map[slug];
  if (!type) throw new Error("Tipo de conta inválido");
  return type;
}
