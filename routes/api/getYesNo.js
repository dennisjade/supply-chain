(function(){
  
  module.exports =  function(app){

    var ppmTrendModel = require('../../models/ppm-trend')
    var arrAlertsModel = require('../../models/arr-alerts')
    var flagMatrixModel = require('../../models/flag-matrix')
    var weibullModel = require('../../models/weibull')
    var config = require('../../config')
    var async = require('async')
    var commonHelpers= require('../../helpers/common')

    getYesNoBox = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      getTrends = function(callback){
        ppmTrendModel.getTrends(partNumber, function(err, docs){
          if (err) {
            console.log('Error getting PPM TRENDS: ', err);
            callback(err, null)
          } else {
            callback(null, docs)
          }
        });
      } 

      getAlerts = function(callback){
        arrAlertsModel.getAlertCount(partNumber, function(err, docs){
          if (err){
            console.log('Error getting ARR ALERTS ', err)
            callback(err, null)
          } else {
            callback(null, docs)
          }

        })
      }

      getFlagMatrix = function(callback){
        flagMatrixModel.getFlagMatrix(partNumber, function(err, docs){
          if (err){
            console.log('Error getting FLAG METRIX ', err)
            callback(err, null)
          }else{
            callback(null, docs)
          }
        })
      }

      getPrediction = function(callback){
        weibullModel.getWeibull(partNumber, vintage,  function(err, docs){
          if (err){
            console.log('Error getting FLAG METRIX ', err)
            callback(err, null)
          }else{
            callback(null, docs)
          }
        })
      }

      switch (classType){
        case 'ppm':
        case 'arr':
          var fnArr = [getTrends,getAlerts]
          break
        case 'tco':
        case 'overall':
          var fnArr = [getFlagMatrix]
          break;
        case 'weibull':
          var fnArr= [getPrediction]
          break;
      }

      console.log(JSON.stringify(fnArr), classType)
      data = []
      async.eachSeries(fnArr, function(fn, callback){
        fn(function(err, docs){
          if (err)
            callback(err)
          else{
            data.push(docs)
            callback(null)
          }
        })
      }, function(error){
        if (error){
          ret.status = 500
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          if (!data[0]){
            ret.data = "No information found on the DB for <span class='yesno-text'>"+classType.toUpperCase()+':'+partNumber.toUpperCase()+'</span>'
            return res.json(ret)
          }else{
            ret.data= commonHelpers.getYesNoMsg(classType, partNumber, data)
            return res.json(ret)
          }
        }
      })
      

    }

    app.get('/api/yesno-box',getYesNoBox);
  }

}).call(this)
