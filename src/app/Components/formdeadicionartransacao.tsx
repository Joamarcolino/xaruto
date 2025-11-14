

export default function FormAdicionar() {
    return (
        <div className="formdeadicionarcaixa">
            <div className="formdeadicionarcaixa2">
                <div className="formdeadicionarcaixaencapsular">
                <section>
                    <label htmlFor="">Descrição * </label>
                    <input className="formdeadicionarinput" type="text" placeholder="Ex: Almoço" />
                </section>
                <section>
                    <label htmlFor="">Valor (R$)</label>
                    <input className="formdeadicionarinput" type="text" placeholder="150.0" />
                </section>
                </div>
                <div className="formdeadicionarcaixaencapsular">
                <section>
                    <label htmlFor="">Categoria *</label>
                    <select
                        name="Selectcategory"
                        defaultValue=""
                        className="formdeadicionarinput"
                    >
                        <option value="" disabled>Selecione uma categoria</option>
                        <option value="alimentacao">Alimentação</option>
                        <option value="transporte">Transporte</option>
                        <option value="moradia">Moradia</option>
                        <option value="saude">Saúde</option>
                        <option value="lazer">Lazer</option>
                        <option value="educacao">Educação</option>
                        <option value="compras">Compras</option>
                        <option value="salario">Salário</option>
                        <option value="freelance">Freelance</option>
                        <option value="investimentos">Investimentos</option>
                        <option value="outros">Outros</option>
                    </select>
                </section>
                <section>
                    <label htmlFor="">Horário *</label>
                    <input className="formdeadicionarinput" type="text" typeof="date" value={13 - 11 - 2025} min={1 - 1 - 2025} max={32 - 12 - 2025} />
                </section>
                </div>

            </div>
            <div className="formdeadicionarcaixa3">
                <button className="despesas">Despesa</button>
                <button className="receitas">Receita</button>
                <button className="adicionar">Adicionar</button>
            </div>
        </div>
    )
}