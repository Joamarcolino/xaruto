export interface transacaoIncompleta {
    data: string;
    valor: number;
    categoria: string;
    descricao: string | undefined;
}

export interface transacao {
    data: string;
    valor: number;
    categoria: string;
    descricao: string | undefined;
    id: string;
}

export interface mes {
    dinheiroSobra: number,
    saldo: number
    receita: number,
    despesas: number,
    nome: string,
    numero: number,
    transacoes: transacao[]
}

export interface parteGraficoPizza {
    nome: string,
    valor: number
}