export default function Tempomes() {
    const dataTempo: Date = new Date()
    const totalDias: number = (new Date(dataTempo.getFullYear(), dataTempo.getMonth() + 0, 0)).getDate()
    const porcento: number = Math.round(dataTempo.getDate() / totalDias * 100) / 100
    console.log(porcento)

    return (
        <div className="tempomes">
            <p>{porcento*100 + "%"}</p>

            <svg width={100} height={60}>
                <rect width={90*porcento} height={45} x={0} y={0} rx={5} ry={5} fill="blue" />
                {porcento + "%"}
            </svg>
        </div>
    )
}