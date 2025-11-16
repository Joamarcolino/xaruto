import { ChangeEvent, useState } from "react"
import descricaoExemplos from "../Logic/descricaoExemplos"

interface transacao {
    categoria: string,
    valor: number,
    data: string,
    info: string | undefined
}

interface config {
    moeda: string
    local: string
}

export default function FormAdicionar({ moeda, local }: config) {
    const formatador = Intl.NumberFormat(local, { style: 'currency', currency: moeda, minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const dataTempo: Date = new Date()
    const [tipoTransacao, setTipoTransacao] = useState("")
    const [dataTransacao, setDataTransacao] = useState( dataTempo.getFullYear() + "-" + dataTempo.getMonth() + "-" + dataTempo.getDate() ) 
    const [valorTransacao, setValorTransacao] = useState( 0 )
    const [categoriaTransacao, setCategoriaTransacao] = useState(0)

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

    function dataEvent(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target.value)
        setDataTransacao(event.target.value)
    }

    function valorEvent(event: ChangeEvent<HTMLInputElement>) {
        setValorTransacao( pegarValorDinheiro(event.target.value) )
    }

    function categoriaEvent(event: ChangeEvent<HTMLSelectElement>) {
        setCategoriaTransacao( event.target.selectedIndex )
    }

    return (
        <div className="formdeadicionarcaixa">
            <h1>+ Adicionar Transações</h1>
            <div className="formdeadicionarcaixa2">
                <div className="formdeadicionarcaixaencapsular">
                    <section>
                        <label htmlFor="">Descrição </label>
                        <input className="formdeadicionarinput" type="text" placeholder={"Ex: " + descricaoExemplos[categoriaTransacao][Math.floor(Math.random()*descricaoExemplos[categoriaTransacao].length)]} />
                    </section>
                    <section>
                        <label htmlFor="">{"Valor (" + moeda + ") *"}</label>
                        <input className="formdeadicionarinput" type="text" onChange={valorEvent} value={formatador.format(valorTransacao)} />
                    </section>
                </div>
                <div className="formdeadicionarcaixaencapsular">
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
                    <section>
                        <label htmlFor="">Data *</label>
                        <input className="formdeadicionarinput" type="date" onChange={dataEvent} value={dataTransacao} />
                    </section>
                </div>

            </div>

                <div className="formdeadicionarcaixa3">
                    <button className="despesas" id={checarCorBotaoTransacao("despesa")} onClick={() => { botaoTipoEvent("despesa") }} >Despesa</button>
                    <button className="receitas" id={checarCorBotaoTransacao("receita")} onClick={() => { botaoTipoEvent("receita") }} >Receita</button>
                    <button className="adicionar">+</button>
                </div>
            </div>
    )
}