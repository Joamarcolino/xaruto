import { transacaoIncompleta, transacao, mes } from "./types"
import { mesParaNumero } from "./meses";
import { useState } from "react"

const nomeDoMesAtual = new Date().toLocaleDateString(navigator.language, { month: "long" }).replace(/^\w/, (c) => c.toUpperCase());

let mesTransacoes: transacao[] = []
const mesAtual: mes = {
    dinheiroSobra: 0,
    receita: 0,
    despesas: 0,
    saldo: 0,
    nome: "Novembro",
    numero: 11,
    transacoes: []
}
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
            receitas: data.receita,
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

function criarTransacao( {categoria, valor, data, descricao}: transacaoIncompleta) {
    if (!categoria || !valor || !data ) {return false}
    const id = criarID()
    mesTransacoes.push( {categoria, valor, data, descricao, id} )

    update()
    transacoes.update(mesTransacoes)
    return true
}

function excluirTransacao( id: string ) {
    const removerID = acharTransacao(id)
    if (removerID == -1) {return false}
    mesTransacoes.splice(removerID, 1 )
    return true
}

function update() {
    let receita: number = 0, despesas: number = 0, total = transacoes.mesAtual.dinheiroSobra

    mesTransacoes.forEach(transacao => {
        console.log(transacao.valor)
        if (Math.sign(transacao.valor) < 0) {
            despesas += Math.abs(transacao.valor)
        } else {
            receita += transacao.valor
        }
        total += transacao.valor
    })

    transacoes.mesAtual.nome = nomeDoMesAtual
    transacoes.mesAtual.saldo = total
    transacoes.mesAtual.numero = mesParaNumero[nomeDoMesAtual]
    transacoes.mesAtual.receita = receita
    transacoes.mesAtual.despesas = despesas
    transacoes.mesAtual.transacoes = mesTransacoes
}

// transacoes /\

const transacoes = {
    mesAtual: mesAtual,
    excluirTransacao: excluirTransacao,
    criarTransacao: criarTransacao,
    acharTransacao: acharTransacao,
    acharMesIndex: acharMesIndex,
    carregarMes: carregarMes,
    salvarMes: salvarMes,
    criarMes: criarID,
    update: function(transacoes: transacao[]) {}
}

export default transacoes