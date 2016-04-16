(function(){
  
  module.exports =  function(app){

    var arrModel = require('../../models/arr')
    var config = require('../../config')
    var _ = require('underscore')


    getARRTable = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType

      arrModel.getARRTableValues(partNumber, function(err, docs){
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

    app.get('/api/arrtable', getARRTable)
  }
}).call(this)