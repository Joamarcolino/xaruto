'use client'
import Formdeadicionar from "./Components/formdeadicionartransacao"
import Navbarzin from "./Components/navbar"
import Statsandvalues from "./Components/valoresstats"
import Evolucaodosaldo from "./Components/evolucaodosaldo"

const localUsuario: string = "pt-BR" //navigator.language
const moedaUsuario: string = "BRL" //new Intl.NumberFormat(localUsuario, {style: 'currency', currencyDisplay: 'narrowSymbol'}).resolvedOptions().currency || "BRL"
const dataTempo: Date = new Date()

import transacoes from "./Logic/transacoes"

export default function Home(){
  console.log(transacoes.acharMesIndex)
  return(
    <div className="encapsulador">
      <div className="espacinho"></div>
      <Navbarzin/>
    <main className="corpo">
      <Statsandvalues local={localUsuario} moeda={moedaUsuario} receita={6000} despesas={1000} saldo={3000}/>
      <Formdeadicionar local={localUsuario} moeda={moedaUsuario}/>
      <Evolucaodosaldo local={localUsuario} moeda={moedaUsuario} receita={6000} despesas={1000} saldo={3000} transacoes={55} />
    </main>
    </div>
  )
}
