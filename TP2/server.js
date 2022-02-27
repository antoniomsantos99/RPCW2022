var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
    var path = req.url.substring(1)
    var folders = path.substring(start=0,end=path.lastIndexOf("/"))
    var file = path.substring(start=path.lastIndexOf("/")+1)

    var type = "html"

    if(file.match(".+\.css")) type = "css"
    if(folders.includes("filme")) path = "filmes/f" + file + ".html"
    if(folders.includes("atores")) path +=".html"
    if(folders.includes("categorias")) path +=".html"
    if(path == "/filmes" || path == "/filmes/" || path == "/" || path == "") path = "index.html"
    
    console.log(path)
    console.log(type)
    console.log(fs.existsSync(path))
    fs.readFile(path, function (err, data) {
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