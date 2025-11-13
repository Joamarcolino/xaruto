import { useState } from "react"
export default function Statsandvalues(){
    return(
        <div id="caixastats" className="caixa">
            <div className="valoresstats">
                <h1 className="subtitulo">RECEITA</h1>
                <p>R$ 3.000,0</p>
            </div>
            <div className="valoresstats">
                <h1 className="subtitulo">DESPESA</h1>
                <p>R$ 2.000,0</p>
            </div>
            <div className="valoresstats">
                <h1 className="subtitulo">SALDO ATUAL</h1>
                <p>R$ 1.000,0</p>
                <div>
                <span className="saldonegativo">Saldo negativo</span>
                <span className="saldopositivo">Saldo positivo</span>
                </div>
            </div>
        </div>
    )
}