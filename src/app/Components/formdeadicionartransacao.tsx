import { ChangeEvent, useState } from "react"
import { mensagems, numeroParaCategoria } from "../Logic/categorias"
import Image from "next/image"

import { transacao } from "../Logic/types"
import transacoes from "../Logic/transacoes"

interface props {
    moeda: string,
    formatador: Intl.NumberFormat
}

export default function FormAdicionar({ moeda, formatador }: props) {
    const dataTempo: Date = new Date()
    const [tipoTransacao, setTipoTransacao] = useState("")
    const [valorTransacao, setValorTransacao] = useState(0)
    const [categoriaTransacao, setCategoriaTransacao] = useState(0)
    const [descricaoTransacao, setDescricaoTransacao] = useState("")
    const dataTransacao = dataTempo.getDate() + "/" + (Number(dataTempo.getMonth()) + 1) + "/" + dataTempo.getFullYear() + " " + dataTempo.getHours() + ":" + dataTempo.getMinutes() + ":" + dataTempo.getSeconds()

    function botaoTipoEvent(tipo: string) {
        if (tipo == tipoTransacao) {
            setTipoTransacao("")
        } else {
            setTipoTransacao(tipo)
        }
    }

    function checarCorBotaoTransacao(tipo: string) {
        if (tipo == tipoTransacao) {
            if (tipo == "receita") {
                return "receitacomcor"
            }
            return "despesacomcor"
        }
        return ""
    }

    function pegarValorDinheiro(dinheiro: string) {
        return Number(dinheiro.replaceAll(/[^0-9,]/g, "").replaceAll(",", "."))
    }

    function valorEvent(event: ChangeEvent<HTMLInputElement>) {
        setValorTransacao(pegarValorDinheiro(event.target.value))
    }

    function categoriaEvent(event: ChangeEvent<HTMLSelectElement>) {
        setCategoriaTransacao(event.target.selectedIndex)
    }

    function descricaoEvent(event: ChangeEvent<HTMLInputElement>) {
        setDescricaoTransacao(event.target.value)
    }

    function forcarDoisDigitos(digito: number) {
        if (digito < 10) {
            return "0" + digito
        }
        return digito
    }

    function criarTransacao() {
        if (!(categoriaTransacao && tipoTransacao && valorTransacao)) { return }
        let valorAtual = valorTransacao
        if (tipoTransacao == "despesa") { valorAtual = valorAtual * -1 }

        transacoes.criarTransacao({ categoria: numeroParaCategoria[categoriaTransacao], valor: valorAtual, descricao: descricaoTransacao, data: dataTransacao })

        setCategoriaTransacao(0)
        setDescricaoTransacao("")
        setTipoTransacao("")
        setValorTransacao(0)
    }

    return (
        <div className="formdeadicionarcaixa">
            <h1>+ Adicionar Transações</h1>
            <div className="formdeadicionarcaixa2">
                <div className="formdeadicionarcaixaencapsular">
                    <section>
                        <label htmlFor="">{"Valor (" + moeda + ") *"}</label>
                        <input className="formdeadicionarinput" type="text" onChange={valorEvent} value={formatador.format(valorTransacao)} />
                    </section>
                        <section>
                            <label htmlFor="">Descrição </label>
                            <input className="formdeadicionarinput" type="text" onChange={descricaoEvent} value={descricaoTransacao} placeholder={"Ex: " + mensagems[categoriaTransacao][Math.floor(Math.random() * mensagems[categoriaTransacao].length)]} />
                        </section>
                        <section>
                                <label className="categoria" htmlFor="">Categoria *</label>
                            <select
                                name="Selectcategory"
                                className="formdeadicionarinput"
                                onChange={categoriaEvent}
                                value={categoriaTransacao}
                            >
                                <option value={0} disabled>Selecione uma categoria</option>
                                <option value={1}>Alimentação</option>
                                <option value={2}>Transporte</option>
                                <option value={3}>Moradia</option>
                                <option value={4}>Saúde</option>
                                <option value={5}>Lazer</option>
                                <option value={6}>Educação</option>
                                <option value={7}>Compras</option>
                                <option value={8}>Salário</option>
                                <option value={9}>Trabalho</option>
                                <option value={10}>Investimentos</option>
                                <option value={11}>Outros</option>
                            </select>
                        </section>
                </div>
            </div>

            <div className="formdeadicionarcaixa3">
                <button className="receitas" id={checarCorBotaoTransacao("receita")} onClick={() => { botaoTipoEvent("receita") }} >Receita </button>
                <button className="despesas" id={checarCorBotaoTransacao("despesa")} onClick={() => { botaoTipoEvent("despesa") }} >Despesa </button>
                <button className="adicionar" onClick={criarTransacao}>+</button>
            </div>
        </div>
    )
}