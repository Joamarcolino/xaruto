import Image from 'next/image'
import calendarioImage from "../Images/calendario.png"

export default function Tempomes() {
    const dataTempo: Date = new Date()
    const totalDias: number = (new Date(dataTempo.getFullYear(), dataTempo.getMonth() + 0, 0)).getDate()
    const porcento: number = Math.round(dataTempo.getDate() / totalDias * 100) / 100
    console.log(porcento)

    return (
        <div className="tempomes">
            <p>{porcento*100 + "%"}</p>
            <Image className="calendarioicone" alt={"Calendario"} src={calendarioImage} width={24} height={24} />
        </div>
    )
}