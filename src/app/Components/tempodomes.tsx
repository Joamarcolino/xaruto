import Image from 'next/image'
import calendarioImage from "../Icons/calendario.png"
import { useState } from "react";

export default function Tempomes() {
    const dataTempo: Date = new Date()
    const totalDias: number = (new Date(dataTempo.getFullYear(), dataTempo.getMonth() + 0, 0)).getDate()
    const porcento: number = Math.round((dataTempo.getDate() / totalDias) * 100) / 100
    const [aberto, setAberto] = useState(false)
    const tempoData = new Date()
    const estemes = new Date(tempoData.getFullYear(), tempoData.getMonth(), tempoData.getDate()).toLocaleDateString(undefined, { month: 'long' })

    function conteudoExtra() {
        if (!aberto) {
            return <p>{porcento*100 + "%"}</p>
        }

        return <p>{porcento*100 + "% de " + estemes + " ja passou!"}</p>
    }

    return (
        <div className="tempomes" onMouseEnter={ ()=>{setAberto(true)} } onMouseLeave={ ()=>{setAberto(false)} }>
            {conteudoExtra()}
            <Image className="calendarioicone" alt={"Calendario"} src={calendarioImage} width={24} height={24} />
        </div>
    )
}