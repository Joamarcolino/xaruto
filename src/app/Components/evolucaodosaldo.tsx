import { useEffect, useRef } from "react";
import Image from "next/image"
import iconeTitulo from "../Icons/evolucao.png"

interface Props {
    local: string;
    receita: number;
    despesas: number;
    saldo: number;
    transacoes: number;
    formatador: Intl.NumberFormat;
    mesSelecionado: string;
}

function paraDeRetornarNAN( coisa: number ) {
    if (Number.isNaN(coisa)) {
        return 0
    }
    return coisa
}

export default function Evolucaosaldo({ local, receita, despesas, saldo, transacoes, formatador, mesSelecionado }: Props) {
    const tempoData = new Date()
    const canvaRef = useRef<HTMLCanvasElement | null>(null)
    const movimentacaoTotal = receita + despesas
    
    useEffect(() => {
        const canva = canvaRef.current
        if (!canva) return
        const ctx = canva.getContext("2d") as CanvasRenderingContext2D;
        if (!ctx) return
        ctx.clearRect(0, 0, canva.width, canva.height)

        ctx.fillStyle = "#32cd32"
        ctx.fillRect(0, 0, canva.width * (receita / movimentacaoTotal), canva.height)
        ctx.fillStyle = "#dc143c"
        ctx.fillRect(canva.width * (receita / movimentacaoTotal), 0, canva.width * (despesas / movimentacaoTotal), canva.height)
    })

    return (
        <div className="caixa">
            <div className="evolucaodosaldocaixa">
                <h1>+ Evolução do Saldo </h1>
                <div className="evolucaodosaldocaixa2">
                    <section className="evolucaodosaldoitem" >
                        <label htmlFor="">Saldo atual</label>
                        <p>{formatador.format(saldo)}</p>
                    </section>
                    <section className="evolucaodosaldoitem">
                        <label>Este Mês</label>
                        <p> { mesSelecionado } </p>
                    </section>
                    <section className="evolucaodosaldoitem">
                        <label htmlFor="">Transações</label>
                        <p>{transacoes}</p>
                    </section>
                </div>
                <div className="evolucaodosaldocaixa3">
                    <label htmlFor="">Receitas vs Despesas</label>
                </div>
                <div className="evolucaodosaldocaixa5">
                        <label className="saldoevolucaoreceita">{"Receitas: " + formatador.format(receita) + " (" +  paraDeRetornarNAN(Math.round( receita/movimentacaoTotal * 100 )) + "%)"}</label>
                    <p>{tempoData.getDate() + " de " + mesSelecionado + " de " + tempoData.getFullYear()}</p>
                        <label className="saldoevolucaodespesa">{"Despesas: " + formatador.format(despesas) + " (" +  paraDeRetornarNAN(Math.round( despesas/movimentacaoTotal * 100 )) + "%)"}</label>
                </div>
                <canvas className="graficovaloresstats" ref={canvaRef} />
            </div>
        </div>
    )
}