var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
    var path = req.url.substring(1)
    var folders = path.substring(start=0,end=path.lastIndexOf("/"))
    var file = path.substring(start=path.lastIndexOf("/")+1)


    if(folders.includes("filme")) path = "filmes/f" + file + ".html"
    else if(folders.includes("atores") || folders.includes("categorias")) path +=".html"
    else if(path == "/filmes" || path == "/filmes/" || path == "/" || path == "") path = "index.html"
    
    fs.readFile(decodeURI(path), function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        if (err) {
            res.write('<p>Erro na leitura de ficheiro...</p><a href="/">Voltar<a/>')
        }
        else {
            res.write(data)
        }
        res.end()
    })
}).listen(47031);