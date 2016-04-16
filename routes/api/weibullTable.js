(function(){
  
  module.exports =  function(app){

    var weibullModel = require('../../models/weibull-full-data')
    var config = require('../../config')
    var _ = require('underscore')


    getWEIBULLTable = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType
      var vintage= req.query.vintage

      var options = {ascDesc : 'ASC'}

      weibullModel.getWEIBULLTableValues(partNumber, vintage, options, function(err, docs){
        if (err){
          ret.status = 200
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          if (req.query.format=='highcharts'){
            var categories = _.pluck(docs, 'POH')
            var prediction = _.map(docs, function(item, key) {
                return item.Prediction?parseFloat(item.Prediction.toFixed(5)):0
            })
            var failureRate = _.map(docs, function(item, key) {
              return item['Failure Rate']?parseFloat(item['Failure Rate'].toFixed(5)):0
            })

            var data = {
                  classType: classType.toUpperCase(), 
                  partNumber:partNumber, 
                  vintage: vintage,
                  prediction: prediction,
                  failureRate: failureRate,
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

    app.get('/api/weibulltable', getWEIBULLTable)
  }
}).call(this)