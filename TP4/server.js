const http = require('http')
const url = require('url')
const fs = require('fs')
const axios = require('axios')

async function generateMainPage() {
    var html
    await axios.get('http://localhost:3000/tarefas').then((response) => {
        html = `     
    <head>
    <title>TPC 4</title>
    <link rel="stylesheet" type="text/css" href="TP4.css">
    <meta charset="UTF-8">
    </head>
    <body>
    
    <h1><a href=/>TPC 4</a></h1>
    <div class="menu">

        <div id="center">
            <h2>TO-DO LIST</h2>
            <table>
            <thead>
              <tr>
                <th colspan="14">TO-DO LIST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="7">POR FAZER</td>
                <td colspan="7">FEITO</td>
              </tr>
              <tr>
                <td>Data Criada</td>
                <td>Data Limite</td>
                <td>Responsável</td>
                <td>Tarefa</td>
                <td>Tipo</td>
                <td></td>
                <td></td>
                <td>Data Criada</td>
                <td>Data Limite</td>
                <td>Responsável</td>
                <td>Tarefa</td>
                <td>Tipo</td>
                <td></td>
                <td></td>
              </tr>
`
        const done = [];
        const todo = [];
        response.data.forEach(tarefa => {
            if (tarefa.done) done.push(tarefa)
            else todo.push(tarefa)
        });

        for (let i = 0; i < Math.max(done.length, todo.length); i++) {

            if (i < todo.length)
                html += `<tr>
            <td>${todo[i].dateBeg}</td>
            <td>${todo[i].dateEnd}</td>
            <td>${todo[i].assignee}</td>
            <td>${todo[i].task}</td>
            <td>${todo[i].type}</td>
            <td>
            <form action="/convert/${todo[i].id}" method="POST">
                <input type="submit" value="DONE"/>
            </form>
        </td>
            <td>${todo[i].done}</td>
`
            else
                html += `<tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    `



            if (i < done.length)
                html += `
            <td>${done[i].dateBeg}</td>
            <td>${done[i].dateEnd}</td>
            <td>${done[i].assignee}</td>
            <td>${done[i].task}</td>
            <td>${done[i].type}</td>
            <td>
                <form action="/convert/${done[i].id}" method="POST">
                    <input type="submit" value="TO-DO"/>
                </form>
            </td>
            <td>${done[i].done}</td>
            </tr>
    `
            else
                html += `
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        </tr>
    `

        }


        html += `        
</tbody>
</table>
</div>

    </div>
    </body>
    `
    })
    return html
}

var myserver = http.createServer(async function(req, res) {
    var myurl = url.parse(req.url, true)
    console.log(myurl.pathname)
    switch (req.method) {
        case ("GET"):
            if (myurl.pathname == "/") {
                generateMainPage().then((html) => {
                    res.writeHead(200, {
                        'Content-Type': 'text/html; charset=utf-8'
                    })
                    res.write(html)
                    res.end()
                })
                generateMainPage().catch(function(e) {
                    console.log(e);
                })
            } else if (myurl.pathname == "/TP4.css") {
                fs.readFile("TP4.css", function(err, data) {
                    res.writeHead(200, {
                        'Content-Type': 'text/css; charset=utf-8'
                    })
                    if (err) {
                        res.write('<p>Erro na leitura de ficheiro...</p><a href="/">Voltar<a/>')
                    } else {
                        res.write(data)
                    }
                    res.end()
                })
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html; charset=utf-8'
                })
                res.end('<p>Error. Rout not supported: ' + req.url + '</p>')
            }
            break;
        case("POST"):
            if(/convert\/(.+)/.test(myurl.pathname)){
                var id = myurl.pathname.match(/convert\/(.+)/)[1]

                await axios.get(`http://localhost:3000/tarefas?id=${id}`).then(tarefa => {
                
                console.log(`http://localhost:3000/tarefas?id=${id}`)
                tarefa=tarefa.data[0]
                tarefa["done"] = !tarefa["done"]

                axios.put('http://localhost:3000/tarefas/' + id,tarefa)
                .then(function (response) {
                   console.log(response.data)
                   res.writeHead(301, {'Location': 'http://localhost:4000/'})
                   res.end()
                })
                .catch(function (error) {
                   console.log(error)
                   res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                   res.write('<p>Erro no PUT: ' + error + "</p>")
                   res.write('<p><a href="/">Voltar</a></p>')
                   res.end()
                })
            })}
    }
})

myserver.listen(4000)
console.log("Servidor à escuta na porta 4000...")