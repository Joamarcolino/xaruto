import {useState} from "react"

interface transacao {
    categoria: string,
    valor: number,
    data: string,
    info: string | undefined,
    id: string
}

let transacoes: transacao[] = []

function acharTransacao(id: string) {
    for (let i = 0; i < transacoes.length; i++) {
        const element = transacoes[i];
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

function compararArray(array1: Array<undefined>, array2: Array<undefined>) {
    if (array1.length !== array2.length) { return false }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) { return false } 
    }
    return true
}

function criarTransacao( {categoria, valor, data, info}: transacao) {
    if (!categoria || !valor || !data ) {return false}
    let id = criarID()
    transacoes.push( {categoria, valor, data, info, id} )
    return true
}

function excluirTransacao( id: string ) {
    let removerID = acharTransacao(id)
    if (removerID == -1) {return false}
    transacoes.splice(removerID, 1 )
    return true
}