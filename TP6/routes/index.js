var express = require('express');
var axios = require('axios');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'files'})

/* GET home page. */
router.get('/', function(req, res, next) {
  axios
  .get("http://localhost:3000/files/")
  .then((response) => {
    var ficheiros = response.data;
    res.render("index", {
      files: ficheiros,
    });
  })
  .catch((err) => {
    res.render("error", { error: err });
  });
});

router.post("/", upload.single('ficheiro'),(req, res) => {

    axios
      .post("http://localhost:3000/files", {
        id: req.file.filename,
        nome : req.file.originalname,
        descricao: req.body.descricao,
        formato : req.file.mimetype,
        tamanho : req.file.size
      })
      .then(res.redirect("/"))
      .catch((err) => {
        res.render("error", { error: err });
      });
  });


module.exports = router;
