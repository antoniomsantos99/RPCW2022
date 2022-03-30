var express = require('express');
var axios = require('axios');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'files'})

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  axios
  .get("http://localhost:3000/files?id="+req.params.id)
  .then((response) => {
    var ficheiro = response.data[0];
    var type = ficheiro.formato.split('/')[0]
    console.log(type)
    res.render("ficheiro", {
      file: ficheiro,
      tipo : type
    });
  })
  .catch((err) => {
    res.render("error", { error: err });
  });
});

router.get('/serve/:id', function(req, res, next) {
  axios
  .get("http://localhost:3000/files?id="+req.params.id)
  .then((response) => {
    var ficheiro = response.data[0];
    fs.readFile(`files/${req.params.id}`, function (err, data) {
      res.writeHead(200, { 'Content-Type': ficheiro.formato});
      if (err) {
          res.write('<p>Erro na leitura de ficheiro...</p><a href="/">Voltar<a/>')
      }
      else {
          res.write(data)
      }
      res.end()
  })
  })
  .catch((err) => {
    res.render("error", { error: err });
  });
});

router.post('/delete/:id',function (req, res, next) {
  axios.delete("http://localhost:3000/files/"+req.params.id).then((resposta) => {
  fs.unlinkSync("files/"+req.params.id)
  res.writeHead(301, {
    'Location': 'http://localhost:47031/'
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
});



module.exports = router;
