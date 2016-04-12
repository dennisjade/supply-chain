(function(){
  
  module.exports =  function(app){

    var ppmTrendModel = require('../../models/ppm-trend')
    var arrAlertsModel = require('../../models/arr-alerts')
    var config = require('../../config')
    var async = require('async')

    getYesNoBox = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType

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

      data = []
      async.eachSeries([getTrends,getAlerts], function(fn, callback){
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
            var yesnoMsg= config.yesnoMsg
            yesnoMsg = yesnoMsg.replace(/\n/g, '<br/>')
            yesnoMsg = yesnoMsg.replace('#{classType}', '<span class="yesno-text">'+classType.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{partNumber}', '<span class="yesno-text">'+partNumber.toUpperCase()+'</span>')
            yesnoMsg = yesnoMsg.replace('#{trend1}', '<span class="yesno-text">'+(data[0]?data[0].PPM_FLAG_TEXT:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{trend2}', '<span class="yesno-text">'+(data[0]?data[0].TREND_TEXT:'')+'</span>')
            yesnoMsg = yesnoMsg.replace('#{alertsCount}', '<span class="yesno-text">'+(data[1]?data[1].ALERTS_SUMMARY:'')+'</span>')
            yesnoMsg += '<div class="yesno-button"><button class="btn btn-small btn-success">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger">No</button></div>' 
            ret.data = yesnoMsg
            return res.json(ret)
          }
        }
      })
      

    }

    app.get('/api/yesno-box',getYesNoBox);
  }

}).call(this)
