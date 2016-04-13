(function(){
  
  module.exports =  function(app){

    var ppmModel = require('../../models/ppm')
    var config = require('../../config')
    var async = require('async')
    var _ = require('underscore')


    getPPMTable = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType

      ppmModel.getPPMTableValues(partNumber, function(err, docs){
        if (err){
          ret.status = 200
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          if (req.query.format=='highcharts'){
            console.log(docs)
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var categories = _.map(docs, function(item, key){return monthNames[parseInt(item.PERIOD_MONTH)-1]+' \''+item.PERIOD_YEAR.toString().substr(2,2)})
            var cummShippedQty = _.pluck(docs, 'cum_SHIPPED_QTY')
            var ppm = _.pluck(docs, 'PPM')
            var avgPPM = _.pluck(docs, 'avg_PPM')
            var data = {
                  classType: classType.toUpperCase(), 
                  partNumber:partNumber, 
                  ppm : _.map(ppm, Number) ,
                  avgPPM : _.map(avgPPM,Number) ,
                  cummShippedQty : _.map(cummShippedQty,Number) ,
                  categories: categories
                }
            ret.data = data
            return res.json(ret)
          }else {
            ret.data = docs
            return res.json(ret)
          }
        }
      })
    }

    app.get('/api/ppmtable', getPPMTable)
  }
}).call(this)