import { useRef, useEffect } from "react";

interface Item {
    nome: string;
    valor: number;
}

interface Props {
    raio: number;
    partes: Item[];
    id: string;
}

export default function GraficoPizza({ id, raio, partes }: Props) {
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
            ctx.beginPath()
            partes.forEach(item => {
                porcento = (Math.round((item.valor / total) * 100) / 100)
                cor = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")"
                ctx.clearRect(0, 0, raio*2 + 20, raio*2 + 20)
                ctx.fillStyle = cor
                ctx.arc(raio + 10, raio + 10, raio, 0,
                    comeco + (2*Math.PI)*porcento)
                ctx.lineWidth = 5;
                ctx.strokeStyle = cor;

                ctx.font = "35px Arial";
                ctx.fillText(item.nome, raio + (Math.cos(comeco)*50), raio + (Math.sin(comeco)*50))
                comeco += (2*Math.PI)*porcento
            });//desenhar grafico.
            ctx.stroke()
//      <GraficoPizza id={"graficoPizza"} raio={120} partes={ [{ nome:"hi", valor:20}, {nome:"bye", valor:50}] } />   <------ teu código desgraça
    })

    return <canvas className={id} width={raio * 2 + 20} height={raio * 2 + 20} ref={canvaRef} />
}