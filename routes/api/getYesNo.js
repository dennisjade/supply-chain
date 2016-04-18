(function(){
  
  module.exports =  function(app){

    var ppmTrendModel = require('../../models/ppm-trend')
    var arrAlertsModel = require('../../models/arr-alerts')
    var flagMatrixModel = require('../../models/flag-matrix')
    var weibullModel = require('../../models/weibull')
    var arrModel = require('../../models/arr')
    var tcoModel = require('../../models/tco')
    var config = require('../../config')
    var async = require('async')
    var commonHelpers= require('../../helpers/common')
    var _ = require('underscore')

    getTrends = function(partNumber, vintage, callback){
      ppmTrendModel.getTrends(partNumber, function(err, docs){
        if (err) {
          console.log('Error getting PPM TRENDS: ', err);
          callback(err, null)
        } else {
          callback(null, docs)
        }
      });
    } 

    getAlerts = function(partNumber, vintage, callback){
      arrAlertsModel.getAlertCount(partNumber, function(err, docs){
        if (err){
          console.log('Error getting ARR ALERTS ', err)
          callback(err, null)
        } else {
          callback(null, docs)
        }

      })
    }

    getFlagMatrix = function(partNumber, vintage, callback){
      flagMatrixModel.getFlagMatrix(partNumber, function(err, docs){
        if (err){
          console.log('Error getting FLAG METRIX ', err)
          callback(err, null)
        }else{
          callback(null, docs)
        }
      })
    }

    getWeibullData = function(partNumber, vintage, callback){
      weibullModel.getWeibullTableValues(partNumber, vintage,  function(err, docs){
        if (err){
          console.log('Error getting FLAG METRIX ', err)
          callback(err, null)
        }else{
          callback(null, docs)
        }
      })
    }

    getYesNoBox = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      switch (classType){
        case 'ppm':
        case 'arr':
          var fnArr = [ getTrends, getAlerts]
          break
        case 'tco':
        case 'overall':
          var fnArr = [ getFlagMatrix]
          break;
        case 'weibull':
          var fnArr= [ getWeibullData ]
          break;
      }

      console.log(JSON.stringify(fnArr), classType)
      data = []
      async.eachSeries(fnArr, function(fn, callback){
        fn(partNumber, vintage, function(err, docs){
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
            var username = commonHelpers.capitalizeFirstLetter(commonHelpers.parseCookies(req.headers.cookie)['username'].replace("'",''))
            ret.data= commonHelpers.getYesNoMsg(classType, partNumber, data).replace('#{username}', username)
            return res.json(ret)
          }
        }
      })
    }

    noPPM = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      getTrends(partNumber,vintage, function(err, docs){
        if (err){
          ret.status = 500
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          commonHelpers.evaluteNoReplyAction(docs.PPM_FLAG, function(err, action){
            if (err){
              ret.status = 500
              ret.msg = 'Failed'
              ret.data = action
            } else {
              ret.data = action.ACTION
            }
            return res.json(ret)
          })
        }
      })
    }

    noARR = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      arrModel.getStopLight(partNumber,vintage, function(err, docs){
        if (err){
          ret.status = 500
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          commonHelpers.evaluteNoReplyAction(docs.STOP_LIGHT, function(err, action){
            if (err){
              ret.status = 500
              ret.msg = 'Failed'
              ret.data = action
            } else {
              ret.data = action.ACTION
            }
            return res.json(ret)
          })
        }
      })
    }

    noTCO = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      tcoModel.getTCOFlag(partNumber, function(err, docs){
        if (err){
          ret.status = 500
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          commonHelpers.evaluteNoReplyAction(docs.TCO_FLAG, function(err, action){
            if (err){
              ret.status = 500
              ret.msg = 'Failed'
              ret.data = action
            } else {
              ret.data = action.ACTION
            }
            return res.json(ret)
          })
        }
      })
    }

    noWEIBULL = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      weibullModel.getWeibullTableValues(partNumber, vintage, function(err, docs){
        if (err){
          ret.status = 500
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          commonHelpers.evaluteNoReplyAction(docs['5YR-FR_BUCKET'], function(err, action){
            if (err){
              ret.status = 500
              ret.msg = 'Failed'
              ret.data = action
            } else {
              ret.data = action.ACTION
            }
            return res.json(ret)
          })
        }
      })
    }

    noOverall = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType.toLowerCase()
      var vintage  =req.query.vintage

      getFlagMatrix(partNumber, vintage, function(err, docs){
        if (err){
          ret.status = 500
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          var flag = _.max([ docs.ARR_FLAG, docs.PPM_FLAG, docs.TCO_BUCKET, docs.TCO_FLAG, docs['5YR-FR_BUCKET'] ])
          commonHelpers.evaluteNoReplyAction(flag, function(err, action){
            if (err){
              ret.status = 500
              ret.msg = 'Failed'
              ret.data = action
            } else {
              ret.data = action.ACTION
            }
            return res.json(ret)
          })
        }
      })
    }

    app.get('/api/yesno-box',getYesNoBox);
    app.get('/api/no-ppm', noPPM)
    app.get('/api/no-arr', noARR)
    app.get('/api/no-tco', noTCO)
    app.get('/api/no-weibull', noWEIBULL)
    app.get('/api/no-overall', noOverall)
  }

}).call(this)
