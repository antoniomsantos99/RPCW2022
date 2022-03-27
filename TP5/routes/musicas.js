var express = require("express");
var router = express.Router();
var axios = require("axios");

/* GET musicas listing. */
router.get("/", function (req, res, next) {
  axios
    .get("http://localhost:3000/musicas/")
    .then((response) => {
      var musicas = response.data;
      res.render("musicas", {
        musicas: musicas,
        date: new Date().toISOString().substring(0, 10),
      });
    })
    .catch((err) => {
      res.render("error", { error: err });
    });
});

router.get("/:musica", function (req, res, next) {
  axios
    .get("http://localhost:3000/musicas/" + req.params.musica)
    .then((response) => {
      var musica = response.data;
      res.render("musica", {
        musica: musica,
      });
    })
    .catch((err) => {
      res.render("error", { error: err });
    });
});

router.get("/artista/:artista", function (req, res, next) {
  axios
    .get(`http://localhost:3000/musicas?musico=${req.params.artista}`)
    .then((response) => {
      var musica = response.data;
      res.render("artista", {
        musicas: musica,
        artista: req.params.artista,
      });
    })
    .catch((err) => {
      res.render("error", { error: err });
    });
});

router.get("/provincia/:prov", function (req, res, next) {
  axios
    .get(`http://localhost:3000/musicas?prov=${req.params.prov}`)
    .then((response) => {
      res.render("provincia", {
        musicas: response.data,
        provincia: req.params.prov,
      });
    })
    .catch((err) => {
      res.render("error", { error: err });
    });
});

router.post("/", function (req, res, next) {
  axios.get("http://localhost:3000/musicas?_page=1").then((resposta) => {
    axios
      .post("http://localhost:3000/musicas", {
        id: parseInt(resposta.headers["x-total-count"]) + 1,
        tit: req.body.tit,
        musico: req.body.musico,
        prov: req.body.prov,
      })
      .then(res.redirect("/"))
      .catch((err) => {
        res.render("error", { error: err });
      });
  });
});

module.exports = router;
