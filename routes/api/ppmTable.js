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
            //console.log(docs);
            /*
            var currDate  = new Date()
            var startYear = currDate.getFullYear()
            var startMonth = currDate.getMonth()+2

            var tempMonth = currDate.getMonth() - 12 //get only the last
            if (tempMonth<=0){
              startYear -= 1
            }

            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var monthCounter = startMonth
            var yearCounter = startYear
            var categories = []
            var cummShippedQty = []
            var ppm =[]
            var avgPPM = []
            for(var i=0;i<12;i++){
              var record = _.find(docs, function(item){return parseInt(item.PERIOD_MONTH)==monthCounter && parseInt(item.PERIOD_YEAR)==yearCounter})
              categories.push( monthNames[monthCounter-1]+' \''+yearCounter.toString().substr(2,2) )
              cummShippedQty.push( record?parseInt(record.cum_SHIPPED_QTY):0 )
              ppm.push( record?parseInt(record.PPM):0 )
              avgPPM.push( record?parseInt(record.avg_PPM):0)

              monthCounter++;
              if (monthCounter>12){
                monthCounter=1
                yearCounter++
              }
            }
            var data = {
                  classType: classType.toUpperCase(), 
                  partNumber:partNumber, 
                  ppm : ppm,
                  avgPPM : avgPPM,
                  cummShippedQty : cummShippedQty,
                  categories: categories
                }
            */

            
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