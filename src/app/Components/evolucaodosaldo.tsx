import { useEffect, useRef } from "react";

interface Props {
    local: string;
    moeda: string;
    receita: number;
    despesas: number;
    saldo: number;
    transacoes: number;
}

export default function Evolucaosaldo({ local, moeda, receita, despesas, saldo, transacoes }: Props) {
    const tempoData = new Date()
    const formatador = Intl.NumberFormat(local, { style: 'currency', currency: moeda, minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const canvaRef = useRef<HTMLCanvasElement | null>(null)
    const movimentacaoTotal = receita + despesas
    const estemes = new Date(tempoData.getFullYear(), tempoData.getMonth(), tempoData.getDate()).toLocaleDateString(local, { month: 'long' }).replace(/^./, char => char.toUpperCase())
    useEffect(() => {
        const canva = canvaRef.current
        if (!canva) return
        const ctx = canva.getContext("2d") as CanvasRenderingContext2D;
        if (!ctx) return
        ctx.clearRect(0, 0, canva.width, canva.height)

        ctx.fillStyle = "#32cd32"
        ctx.fillRect(0, 0, canva.width * (receita / movimentacaoTotal), canva.height)
        ctx.fillStyle = "#dc143cff"
        ctx.fillRect(canva.width * (receita / movimentacaoTotal), 0, canva.width * (despesas / movimentacaoTotal), canva.height)
    })

    return (
        <div className="caixa">
            <div className="evolucaodosaldocaixa">
                <h1>+ Evolução do Saldo</h1>
                <div className="evolucaodosaldocaixa2">
                    <section className="evolucaodosaldoitem" >
                        <label htmlFor="">Saldo atual</label>
                        <p>{formatador.format(saldo)}</p>
                    </section>
                    <section className="evolucaodosaldoitem">
                        <label>Este Mês</label>
                        <p> { estemes } </p>
                    </section>
                    <section className="evolucaodosaldoitem">
                        <label htmlFor="">Transações</label>
                        <p>{transacoes}</p>
                    </section>
                </div>
                <div className="evolucaodosaldocaixa3">
                    <label htmlFor="">Receitas vs Despesas (Total)</label>
                </div>
                <div className="evolucaodosaldocaixa5">
                        <label className="saldoevolucaoreceita">{"Receitas: " + formatador.format(receita) + " (" +  Math.round( receita/movimentacaoTotal * 100 ) + "%)"}</label>
                    <p>{tempoData.getDate() + " de " + estemes + " de " + tempoData.getFullYear()}</p>
                        <label className="saldoevolucaodespesa">{"Despesas: " + formatador.format(despesas) + " (" +  Math.round( despesas/movimentacaoTotal * 100 ) + "%)"}</label>
                </div>
                <canvas className="graficovaloresstats" ref={canvaRef} />
            </div>
        </div>
    )
}