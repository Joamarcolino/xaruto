import { JSX } from "react/jsx-runtime";

import GraficoPizza from "./graficopizza";
import { Dispatch, SetStateAction, useState } from 'react'
import { transacao } from "../Logic/types"
import transacoes from "../Logic/transacoes"
//id={"graficogastos"} raio={50} tamanho={100} partes={ [ [valor = 50, nome = "hi"] ] }
//

interface props {
    local: string;
    moeda: string;
    graficoPizza: number[];
    transacoes: JSX.Element[];
}

const dataObjeto = new Date
const dataHoje = dataObjeto.getDate() + "/" + (Number(dataObjeto.getMonth())+1).toString() + "/" + dataObjeto.getFullYear()

function compararArray(array1: Array<any>, array2: Array<any>) {
    let index = 0
    if (array1.length !== array2.length) {return false} 
    array1.forEach(elemento => {
        if (elemento !== array2[index]) {return false}
        index++
    })
    console.log("mesma array")
    return true
}

export default function Listadetransacoes({ local, moeda, graficoPizza, transacoes }: props) {
    return (
        <div className="listadetransacoes">
            <h1>+ Lista de transações</h1>
            <div className="listadetransacoescaixa">
                <div className="listadetransacoescaixa2">
                    <div className="listadetransacoescaixa3">
                        <GraficoPizza local={local} moeda={moeda} partes={graficoPizza} />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr className="trtitle">
                            <th> Data </th>
                            <th> Tipo </th>
                            <th> Valor </th>
                            <th> Categoria </th>
                            <th> Saldo </th>
                        </tr>
                    </thead>
                    <tbody>
                       { transacoes}
                    </tbody>
                </table>
            </div>
        </div>
    )
}