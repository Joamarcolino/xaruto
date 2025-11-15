import { useState } from "react"
import Image from 'next/image'
import receitaImage from '../Images/receitas.png'
import saldoImage from '../images/saldo.png'
import despesasImage from '../images/despesas.png'

interface Props {
    local: string;
    moeda: string;
    receita: number;
    despesas: number;
    saldo: number;
}

export default function Statsandvalues({ local, moeda, receita, despesas, saldo }: Props) {
    const formatador = Intl.NumberFormat(local, { style: 'currency', currency: moeda, minimumFractionDigits: 2, maximumFractionDigits: 2 })
    let statusSaldo

    if (saldo < 0) {
        statusSaldo = <span className="saldonegativo">Saldo negativo</span>
    } else {
        statusSaldo = <span className="saldopositivo">Saldo positivo</span>
    }

    return (
        <div id="caixastats" className="caixa">
            <div className="valoresstats">
                <h1 className="subtitulo">SALDO ATUAL</h1>
                <section>
                    <p>{formatador.format(saldo)}</p>
                    <Image alt={"saldo"} src={saldoImage} width={60} height={60} />
                </section>
                <div>
                    {statusSaldo}
                </div>
            </div>
            <div className="valoresstats">
                <h1 className="subtitulo">RECEITAS</h1>
                <section>
                    <p>{formatador.format(receita)}</p>
                    <Image alt={"reiceitas"} src={receitaImage} width={60} height={60} />
                </section>
            </div>
            <div className="valoresstats">
                <h1 className="subtitulo">DESPESAS</h1>
                <section>
                    <p>{formatador.format(despesas)}</p>
                    <Image alt={"despesas"} src={despesasImage} width={60} height={60} />
                </section>
            </div>
        </div>
    )
}