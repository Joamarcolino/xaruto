'use client'
import Formdeadicionar from "./Components/formdeadicionartransacao"
import Navbarzin from "./Components/navbar"
import Statsandvalues from "./Components/valoresstats"

const localUsuario: string = navigator.language
const moedaUsuario: string = "BRL" //new Intl.NumberFormat(localUsuario, {style: 'currency', currencyDisplay: 'narrowSymbol'}).resolvedOptions().currency || "BRL"
const dataTempo: Date = new Date()

export default function Home(){
  return(
    <div className="encapsulador">
      <div className="espacinho">espaçinho lol</div>
      <Navbarzin/>
    <main className="corpo">
      <Statsandvalues local={localUsuario} moeda={moedaUsuario} receita={6000} despesas={1000} saldo={3000}  />
      <Formdeadicionar local={localUsuario} moeda={moedaUsuario}/>
    </main>
    </div>
  )
}
