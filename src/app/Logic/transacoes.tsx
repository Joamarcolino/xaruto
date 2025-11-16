interface transacao {
    categoria: string,
    valor: number,
    data: string,
    info: string | undefined,
    id: string
}

interface mes {
    receitas: number,
    despesas: number,
    nome: string,
    numero: string,
    transacoes: transacao[]
}

const mesTransacoes: transacao[] = []
//let mesNumero: number = 0
//let mesNome: string = ""

function criarMes(data: mes) {
    let mesesTotal: number = Number(localStorage.getItem("mesesTotal") )
    if (!mesesTotal) {localStorage.setItem("mesesTotal", "1"); mesesTotal = 1}
    if (mesesTotal == 12) {
        for (let i = 0; i < 11; i++) {
            const mes: string | null = localStorage.getItem("mes_" + (11-i));
            if (mes) { localStorage.setItem("mes_" + ((11-1)+1), mes) } 
        }
    }
    localStorage.setItem("mes_1", JSON.stringify(data))
}

function salvarMes(index: number, data: mes) {
    if (localStorage.getItem("mes_" + (index))) {
        localStorage.setItem("mes_" + (index), JSON.stringify({
            receitas: data.receitas,
            despesas: data.despesas,
            nome: data.nome,
            numero: data.numero,
            transacoes: JSON.stringify( data.transacoes )}
        ))}
}

function carregarMes(index: number) {
    const mes: string | null = localStorage.getItem("mes_" + (index+1))
    if (!mes) {return}
    const mesData: mes | null = JSON.parse(mes)
    if (!mesData) {return}
    return mesData
}

function acharMesIndex(nome: string) {
    for (let i = 0; i < 12; i++) {
        const mesData: mes | undefined = carregarMes(i)
        if (mesData && mesData.nome == nome) { return i }
    }
    return
}

// Mes /\, Transacoes \/

function acharTransacao(id: string) {
    for (let i = 0; i < mesTransacoes.length; i++) {
        const element = mesTransacoes[i];
        if (element.id == id) {return i}
    }
    return -1
}

const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
function criarID() {
    let valido = false
    let novoID = ""
    while (!valido) {
        novoID = ""
        for (let i = 0; i < 40; i++) {
            novoID += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        }
        valido = acharTransacao(novoID) == -1
    }
    return novoID
}

function criarTransacao( {categoria, valor, data, info}: transacao) {
    if (!categoria || !valor || !data ) {return false}
    const id = criarID()
    mesTransacoes.push( {categoria, valor, data, info, id} )
    return true
}

function excluirTransacao( id: string ) {
    const removerID = acharTransacao(id)
    if (removerID == -1) {return false}
    mesTransacoes.splice(removerID, 1 )
    return true
}

// transacoes /\

const transacoes = {
    excluirTransacao: excluirTransacao,
    criarTransacao: criarTransacao,
    acharTransacao: acharTransacao,
    acharMesIndex: acharMesIndex,
    carregarMes: carregarMes,
    salvarMes: salvarMes,
    criarMes: criarID
}

export default transacoes