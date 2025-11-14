import { useRef, useEffect } from "react";

interface Item {
    nome: string;
    valor: number;
}

interface Props {
    raio: number;
    tamanho: number;
    partes: Item[];
    id: string;
}

export default function GraficoPizza({ id, raio, tamanho, partes }: Props) {
    let total = 0;

    partes.forEach(item => {
        total += item.valor
    });//pegar total de dinheiro dado.

    const canvaRef = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const canva = canvaRef.current
        if (!canva) return
        const ctx = canva.getContext("2d") as CanvasRenderingContext2D;
        if (!ctx) return

        let cor = "rgb"
        let comeco = 0;
        let porcento = 0;
        ctx.clearRect(0, 0, raio * 2 + 20, raio * 2 + 20)
        partes.forEach(item => {
            porcento = (Math.round((item.valor / total) * 100) / 100)
            cor = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")"

            ctx.beginPath()
            ctx.lineWidth = 5
            ctx.fillStyle = cor
            ctx.strokeStyle = cor
            ctx.arc(tamanho/2, tamanho/2, raio, comeco, comeco + (Math.PI * 2) * porcento)

            ctx.moveTo( tamanho/2 + Math.cos( comeco ) * raio, tamanho/2 + Math.sin( comeco) * raio )
            ctx.lineTo( tamanho/2, tamanho/2 )
            ctx.lineTo( tamanho/2 + Math.cos(comeco + ((Math.PI * 2) * porcento)) * raio, tamanho/2 + Math.sin(comeco + ((Math.PI * 2) * porcento)) * raio )
            ctx.lineTo( tamanho/2 + Math.cos( comeco ) * raio, tamanho/2 + Math.sin( comeco) * raio )

            ctx.stroke()
            ctx.fill()
            ctx.closePath()

            ctx.lineWidth = 1
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.font = "35px Arial";
            ctx.fillText(item.nome,
                tamanho/2 + (Math.cos(((Math.PI * 2) * porcento) / 2 + comeco) * raio),
                tamanho/2 + (Math.sin(((Math.PI * 2) * porcento) / 2 + comeco) * raio))
                ctx.strokeText(item.nome,
                tamanho/2 + (Math.cos(((Math.PI * 2) * porcento) / 2 + comeco) * raio),
                tamanho/2 + (Math.sin(((Math.PI * 2) * porcento) / 2 + comeco) * raio))
            comeco += ((Math.PI * 2) * porcento)
        });//desenhar grafico.
        ctx.beginPath()
        ctx.fillStyle="white"
        ctx.arc(tamanho/2, tamanho/2, raio/2, 0, Math.PI*2)
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        partes.forEach(item => {
            
        })
    })
    return <canvas className={id} width={tamanho} height={tamanho} ref={canvaRef} />
}