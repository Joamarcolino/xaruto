'use client'
import Formdeadicionar from "./Components/formdeadicionartransacao"
import Navbarzin from "./Components/navbar"
import Statsandvalues from "./Components/valoresstats"
export default function Home(){
  return(
    <div className="encapsulador">
      <div className="espacinho">espaçinho lol</div>
      <Navbarzin/>
    <main className="corpo">
      <Statsandvalues/>
      <Formdeadicionar/>
    </main>
    </div>
  )
}