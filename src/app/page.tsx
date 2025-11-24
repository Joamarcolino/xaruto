'use client'
import { JSX, useState } from "react"
import Formdeadicionar from "./Components/formdeadicionartransacao"
import Navbarzin from "./Components/navbar"
import Statsandvalues from "./Components/valoresstats"
import Evolucaodosaldo from "./Components/evolucaodosaldo"
import Listadetransacoes from "./Components/listadetransacoes"

const localUsuario: string = "pt-BR" //navigator.language
const moedaUsuario: string = "BRL" //new Intl.NumberFormat(localUsuario, {style: 'currency', currencyDisplay: 'narrowSymbol'}).resolvedOptions().currency || "BRL"
const dataTempo: Date = new Date()

import GraficoPizza from "./Components/graficopizza"
import transacoes from "./Logic/transacoes"
import { numeroParaCategoria } from "./Logic/categorias"
import { transacao, mes, parteGraficoPizza } from "./Logic/types"
const formatador = Intl.NumberFormat(localUsuario, { style: 'currency', currency: moedaUsuario, minimumFractionDigits: 2, maximumFractionDigits: 2 })

const dataObjeto = new Date
const dataHoje = dataObjeto.getDate() + "/" + (Number(dataObjeto.getMonth()) + 1).toString() + "/" + dataObjeto.getFullYear()

function criarTransacaoUI(data: string, valor: number, categoria: string, UltimoValor: number, formatador: Intl.NumberFormat, index: number) {
  let tipo = (valor > 0) ? "Recebimento" : "Pagamento"

  return (
    <tr key={index}>
      <th id={(data.split(" ")[0] == dataHoje) ? "transacao_hoje" : ""} scope="row">{data}</th>
      <th id={"transacao_" + tipo.toLocaleLowerCase()} >{tipo}</th>
      <th>{formatador.format(valor)}</th>
      <th>{categoria}</th>
      <th>{formatador.format(UltimoValor + valor)}</th>
    </tr>
  )
}

function renderTransacoes(transacoes: transacao[]) {
  let ValorInicial: number = 0
  let objetos: JSX.Element[] = []

  let index = 0
  console.log(transacoes.length)
  transacoes.forEach(Item => {
    objetos.push(criarTransacaoUI(Item.data, Item.valor, Item.categoria, ValorInicial, formatador, index))
    ValorInicial += Item.valor
    index++
  });

  return objetos.reverse()
}

export default function Home() {
  const [forceUpdate, setUpdate] = useState(false)
  const [mesAtual, setMesAtual] = useState(transacoes.mesAtual as unknown as mes)

  transacoes.update = function (updateContent: transacao[]) {
    setUpdate(!forceUpdate)
    setMesAtual(transacoes.mesAtual)
  }

  let conteudo: any = []
  mesAtual.transacoes.forEach((transacao: transacao) => {
    if (conteudo[transacao.categoria] == undefined) { conteudo[numeroParaCategoria.indexOf(transacao.categoria)] = 0 }
    conteudo[numeroParaCategoria.indexOf(transacao.categoria)] += Math.abs(transacao.valor)
  })

  return (
    <div className="encapsulador">
      <div className="espacinho"></div>
      <Navbarzin />
      <main className="corpo">
        <Statsandvalues formatador={formatador} receita={mesAtual.receita} despesas={mesAtual.despesas} saldo={mesAtual.saldo} />
        <Evolucaodosaldo local={localUsuario} receita={mesAtual.receita} despesas={mesAtual.despesas} saldo={mesAtual.saldo} transacoes={mesAtual.transacoes.length} formatador={formatador} mesSelecionado={mesAtual.nome} />
        <Formdeadicionar moeda={moedaUsuario} formatador={formatador} />
        <Listadetransacoes local={localUsuario} moeda={moedaUsuario} graficoPizza={ conteudo } transacoes={renderTransacoes(mesAtual.transacoes)} />
      </main>
    </div>
  )
}
