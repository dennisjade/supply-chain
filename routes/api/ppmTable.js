(function(){
  
  module.exports =  function(app){

    var ppmModel = require('../../models/ppm')
    var config = require('../../config')
    var async = require('async')


    getPPMTable = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber

      ppmModel.getPPMTableValues(partNumber, function(err, docs){
        if (err){
          ret.status = 200
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          ret.data = docs
          return res.json(ret)
        }
      })
    }

    app.get('/api/ppmtable', getPPMTable)
  }
}).call(this)