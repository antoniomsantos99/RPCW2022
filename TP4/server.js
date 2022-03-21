import http from 'http';
import axios from 'axios';
import url from 'url';
import fs from 'fs';
import {
	serveStaticResource,
	getPOSTInfo
} from './auxiliar.js';


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
            <form action="/add/" method="POST">
            <table>
            <thead>
              <tr>
                <th colspan="4">Adicionar tarefa</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data Limite</td>
                <td>Responsável</td>
                <td>Tarefa</td>
                <td>Tipo</td>
              </tr>
              <tr>
                <td><input type="date" name="dateEnd"><br></td>
                <td><input type="text" name="assignee"><br></td>
                <td><input type="text" name="task"><br></td>
                <td><input type="text" name="type"><br></td>
              </tr>
              <tr>
            <th colspan="4">
              <input type="submit" value="Adicionar"/></th>
              
            </tr>
              </tbody>
              </table>
              </form>
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
		console.log(todo)

		for (let i = 0; i < Math.max(done.length, todo.length); i++) {
			console.log(todo.length,done.length)
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
<td>            <form action="/delete/${todo[i].id}" method="POST">
            <input type="submit" value="DELETE"/>
        </form></td>
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
            <td>
            <form action="/delete/${done[i].id}" method="POST">
                <input type="submit" value="DELETE"/>
            </form>
        </td>
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
				res.end('<p>Error. Route not supported: ' + req.url + '</p>')
			}
			break;
		case ("POST"):
			var tokens = myurl.pathname.match(/\/(\w+)\/(.*)/)
			switch (tokens[1]) {
				case "convert":
					await axios.get(`http://localhost:3000/tarefas?id=${tokens[2]}`).then(tarefa => {

						console.log(`http://localhost:3000/tarefas?id=${tokens[2]}`)
						tarefa = tarefa.data[0]
						tarefa["done"] = !tarefa["done"]

						axios.put('http://localhost:3000/tarefas/' + tokens[2], tarefa)
							.then(function(resp) {
								console.log(resp)
								res.writeHead(301, {
									'Location': 'http://localhost:4000/'
								})
								res.end()
							})
							.catch(function(error) {
								console.log(error)
								res.writeHead(500, {
									'Content-Type': 'text/html;charset=utf-8'
								})
								res.write('<p><a href="/">Voltar</a></p>')
								res.end()
							})
					})
					break
				case "delete":
					await axios.delete(`http://localhost:3000/tarefas/${tokens[2]}`).then(resp => {

							console.log(resp.data)
							res.writeHead(301, {
								'Location': 'http://localhost:4000/'
							})
							res.end()
						})
						.catch(function(error) {
							console.log(error)
							res.writeHead(500, {
								'Content-Type': 'text/html;charset=utf-8'
							})
							res.write('<p><a href="/">Voltar</a></p>')
							res.end()
						})

					break

				case "add":
					console.log("Teste")
					getPOSTInfo(req, result => {
						console.log(result)

						result['dateBeg'] = new Date().toISOString().slice(0, 10)
						result['done'] = false
						axios.post('http://localhost:3000/tarefas', result)
							.then(resp => {
								res.writeHead(301, {
									'Location': 'http://localhost:4000/'
								})
								res.end()
							})
							.catch(erro => {
								res.writeHead(500, {
									'Content-Type': 'text/html;charset=utf-8'
								})
								res.write('<p>Erro no POST: ' + erro + "</p>")
								res.write('<p><a href="/">Voltar</a></p>')
								res.end()
							})
					})



					break
			}
	}
})

myserver.listen(4000)
console.log("Servidor à escuta na porta 4000...")