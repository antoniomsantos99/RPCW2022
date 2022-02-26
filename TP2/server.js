var http = require('http')
var fs = require('fs')

http.createServer(function (req, res) {
    var myurl = req.url.substring(1)
    var path = myurl.substring(start=0,end=myurl.lastIndexOf("/"))
    var file = myurl.substring(start=myurl.lastIndexOf("/"))
    console.log(path)
    console.log(file)
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