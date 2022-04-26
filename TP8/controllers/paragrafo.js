var Paragrafo = require('../models/paragrafo')
var mongoose = require('mongoose')

module.exports.listar = function (){
    return Paragrafo.find().exec()
}

module.exports.inserir = function (p){
    var d = new Date().toISOString().substring(0,16)
    p.data = d
    var par = new Paragrafo(p)
    return par.save()
}

module.exports.delete = function(id) {
    return Paragrafo.deleteOne({_id: mongoose.Types.ObjectId(id)}).exec()
}

module.exports.edit = async function(id,data) {
    var p = await Paragrafo.findById(id).exec()
    p.data = new Date().toISOString().substring(0,16)
    p.paragrafo = data.paragrafo
    return p.save()
}