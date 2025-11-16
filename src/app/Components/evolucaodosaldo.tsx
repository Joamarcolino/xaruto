interface Props {
    local: string;
    moeda: string;
    receita: number;
    despesas: number;
    saldo: number;
    transacoes: number;
}

export default function Evolucaosaldo( {local, moeda, receita, despesas, saldo, transacoes}: Props ) {
    const tempoData = new Date()
    const formatador = Intl.NumberFormat(local, { style: 'currency', currency: moeda, minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return (
        <div className="caixa">
            <div className="evolucaodosaldocaixa">
                <h1>+ Evolução do Saldo</h1>
                <div className="evolucaodosaldocaixa2">
                    <section>
                        <label htmlFor="">Saldo atual</label>
                        <p>{formatador.format(saldo) }</p>
                    </section>
                    <section>
                        <label>Este Mes</label>
                        <p>sigma</p>
                    </section>
                    <section>
                        <label htmlFor="">Transações</label>
                        <p>{transacoes}</p>
                    </section>
                </div>
                <div className="evolucaodosaldocaixa3">
                    <label htmlFor="">Receitas vs Despesas (Total)</label>
                    <div className="evolucaodosaldocaixa4">
                        <label>{"Receitas: " + formatador.format(receita) }</label>
                        <label>{"Despesas: " + formatador.format(despesas) }</label>
                    </div>
                </div>
                <div className="evolucaodosaldocaixa5">
                    <p>{ tempoData.getDate() + " de " + new Date(tempoData.getFullYear(), tempoData.getMonth(), tempoData.getDate()).toLocaleDateString(local, { month: 'long' }).replace(/^./, char => char.toUpperCase()) + " de " + tempoData.getFullYear() }</p>
                </div>
            </div>
        </div>
    )
}