import { useRef, useEffect } from "react";

interface Props {
    partes: number[];
    local: string;
    moeda: string;
}

export default function graficopizza({ local, moeda, partes }: Props) {
    let total = 0;

    const corborda = "#d2b48c"
    const coresCategorias = ["#3B1D07", "#553012", "#6E4320", "#87572F", "#A06B3D", "#BA804C", "#D4955C", "#2F1706", "#241104", "#472710", "#5C341A"]

    partes.forEach(item => {
        total += item
    });//pegar total de dinheiro dado.

    let offsetx = 0, offsety = 0
    const canvaRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const canva = canvaRef.current
        if (!canva) return
        const ctx = canva.getContext("2d") as CanvasRenderingContext2D;
        if (!ctx) return

        let raio = Math.max(Math.min(canva.width, canva.height) / 2 - 10, 1)
        let comeco = 0;
        let porcento = 0;
        ctx.clearRect(0, 0, canva.width, canva.height)

        canva.width = 400
        canva.height = 400

        let index = 0
        partes.forEach(item => {
            porcento = (Math.round((item / total) * 100) / 100)

            const pos1: number = (Math.PI * 2) * comeco
            const pos2: number = (Math.PI * 2) * (comeco + porcento)
            const pos3: number = (Math.PI * 2) * (comeco + (porcento / 2))
            comeco += porcento

            console.log(coresCategorias[index])
            ctx.beginPath()
            ctx.fillStyle = coresCategorias[index]
            ctx.strokeStyle = corborda
            ctx.lineWidth = 7
            console.log(raio)
            ctx.arc(canva.width / 2, canva.height / 2, raio, pos1, pos2)
            ctx.lineTo(canva.width / 2, canva.height / 2)
            ctx.lineTo((canva.width / 2) + Math.cos(pos1) * raio, (canva.height / 2) + Math.sin(pos1) * raio)
            ctx.stroke()
            ctx.fill()
            ctx.closePath()
            index++
        });//desenhar grafico.

    ctx.beginPath()
    ctx.fillStyle = corborda
    ctx.arc(canva.width / 2, canva.height / 2, 40, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.arc(canva.width / 2, canva.height / 2, 35, 0, Math.PI * 2)
    ctx.fill()
    ctx.clip()
    ctx.clearRect(0, 0, canva.width, canva.height)
    })
    return <canvas className="graficopizza" width={400} height={400} ref={canvaRef} />
}