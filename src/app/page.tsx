'use client'
import Formdeadicionar from "./Components/formdeadicionartransacao"
import Navbarzin from "./Components/navbar"
import Statsandvalues from "./Components/valoresstats"

const localUsuario: string = navigator.language
//const moedaUsuario: string = new Intl.NumberFormat(localUsuario, {style: 'currency', currencyDisplay: 'narrowSymbol'}).resolvedOptions().currency || "BRL"

export default function Home(){
  return(
    <div className="encapsulador">
      <div className="espacinho">espaçinho lol</div>
      <Navbarzin/>
    <main className="corpo">
      <Statsandvalues local={localUsuario} moeda={"BRL"} receita={6000.30} despesas={1000.00} saldo={3000.00}  />
      <Formdeadicionar/>
    </main>
    </div>
  )
}
