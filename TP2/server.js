var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
    var myurl = req.url
    console.log(myurl)
    fs.readFile('./filmes/f' + myurl + '.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (err) {
            res.write("<p>Erro na leitura de ficheiro...</p>")
        }
        else {
            res.write(data)
        }
        res.end()
    })
}).listen(47031);