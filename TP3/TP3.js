const http = require('http')
const url = require('url')
const fs = require('fs')
const axios = require('axios')

function generateMainPage() {
    page = `
    <head>
    <title>TPC 3</title>
    <link rel="stylesheet" type="text/css" href="TP3.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a href=/>TPC 3</a></h1>
    <div class="menu">
        <div id="left">
            <h2><a href=/cursos>Lista de Cursos</a></h2>
        </div>

        <div class="center">
            <h2><a href=/alunos>Lista de Alunos</a></h2>
        </div>

        <div id="right">
            <h2><a href=/instrumentos>Lista de Instrumentos</a></h2>
        </div>
    </div>
    </body>
    `
    return page
}

async function generateAlunosPage(){
    var html
    await axios.get('http://localhost:3000/alunos').then((response) => {html =`     
    <head>
    <title>TPC 3</title>
    <link rel="stylesheet" type="text/css" href="TP3.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a href=/>TPC 3</a></h1>
    <div class="menu">

        <div id="center">
            <h2>Lista de Alunos</h2>
            <table>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Curso</th>
                <th>Instrumento</th>
            </tr>
`
html += response.data.map(function(aluno){
    return `<tr>
    <td>${aluno.id}</td>
    <td>${aluno.nome}</td>
    <td>${aluno.curso}</td>
    <td>${aluno.instrumento}</td>
</tr>`}).join("\n")

html+=`        </div>

    </div>
    </body>
    `})

return html
}

async function generateAlunosPage(){
    var html
    await axios.get('http://localhost:3000/alunos').then((response) => {html =`     
    <head>
    <title>TPC 3</title>
    <link rel="stylesheet" type="text/css" href="TP3.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a href=/>TPC 3</a></h1>
    <div class="menu">

        <div class="center">
            <h2>Lista de Alunos</h2>
            <table>
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Curso</th>
                <th>Instrumento</th>
            </tr>
`
html += response.data.map(function(aluno){
    return `<tr>
    <td>${aluno.id}</td>
    <td>${aluno.nome}</td>
    <td>${aluno.curso}</td>
    <td>${aluno.instrumento}</td>
</tr>`}).join("\n")

html+=`        </div>

    </div>
    </body>
    `})

return html
}

async function generateCursosPage(){
    var html
    await axios.get('http://localhost:3000/cursos').then((response) => {html =`     
    <head>
    <title>TPC 3</title>
    <link rel="stylesheet" type="text/css" href="TP3.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a href=/>TPC 3</a></h1>
    <div class="menu">

        <div class="center">
            <h2>Lista de Cursos</h2>
            <table>
            <tr>
                <th>ID</th>
                <th>Designação</th>
                <th>Duração</th>
                <th>Instrumento</th>
            </tr>
`
html += response.data.map(function(curso){
    return `<tr>
    <td>${curso.id}</td>
    <td>${curso.designacao}</td>
    <td>${curso.duracao}</td>
    <td>${curso.instrumento["#text"]}</td>
</tr>`}).join("\n")

html+=`        </div>

    </div>
    </body>
    `})

return html
}

async function generateInstrumentosPage(){
    var html
    await axios.get('http://localhost:3000/instrumentos').then((response) => {html =`     
    <head>
    <title>TPC 3</title>
    <link rel="stylesheet" type="text/css" href="TP3.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a href=/>TPC 3</a></h1>
    <div class="menu">

        <div class="center">
            <h2>Lista de Instrumentos</h2>
            <table>
            <tr>
                <th>ID</th>
                <th>Nome</th>
            </tr>
`
html += response.data.map(function(instrumento){
    return `<tr>
    <td>${instrumento.id}</td>
    <td>${instrumento["#text"]}</td>
</tr>`}).join("\n")

html+=`        </div>

    </div>
    </body>
    `})

return html
}

var myserver = http.createServer(function (req, res) {
    var myurl = url.parse(req.url, true)
    console.log(myurl.pathname)
    if (myurl.pathname == "/"){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write(generateMainPage())
        res.end()
        
    }
    else if (myurl.pathname == "/alunos") {
    generateAlunosPage().then((html) => {res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.write(html)
        res.end()})
    }
    else if (myurl.pathname == "/cursos") {
        generateCursosPage().then((html) => {res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(html)
            res.end()})
        }
    else if (myurl.pathname == "/instrumentos") {
            generateInstrumentosPage().then((html) => {res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.write(html)
                res.end()})
        }
    else if (myurl.pathname == "/TP3.css") {  
    fs.readFile("TP3.css", function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/css; charset=utf-8'})
        if (err) {
            res.write('<p>Erro na leitura de ficheiro...</p><a href="/">Voltar<a/>')
        }
        else {
            res.write(data)
        }
        res.end()
    })
}
    else {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        res.end('<p>Error. Rout not supported: ' +  req.url + '</p>')
    }
})

myserver.listen(4000)
console.log("Servidor à escuta na porta 4000...")