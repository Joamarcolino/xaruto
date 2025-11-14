import { useState } from "react"
import mais from '../Images/mais.png'

interface Props {
    local: string;
    moeda: string;
    receita: number;
    despesas: number;
    saldo: number;}

export default function Statsandvalues( {local, moeda, receita, despesas, saldo}: Props){
    const formatador = Intl.NumberFormat(local, { style: 'currency', currency: moeda, minimumFractionDigits: 2, maximumFractionDigits: 2 })
    let statusSaldo

    if (saldo < 0) {
        statusSaldo = <span className="saldonegativo">Saldo negativo</span>
    } else {
        statusSaldo = <span className="saldopositivo">Saldo positivo</span>
    }

    return(
        <div id="caixastats" className="caixa">
            <div className="valoresstats">
                <h1 className="subtitulo">SALDO ATUAL</h1>
                <p>{ formatador.format(saldo) }</p>
                <div>
                    { statusSaldo }
                </div>
            </div>
            <div className="valoresstats">
                <h1 className="subtitulo">RECEITAS</h1>
                <p>{ formatador.format(receita)  }</p>
            </div>
            <div className="valoresstats">
                <h1 className="subtitulo">DESPESAS</h1>
                <p>{ formatador.format(despesas) }</p>
            </div>
        </div>
    )
}