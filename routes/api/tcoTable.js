(function(){
  
  module.exports =  function(app){

    var tcoModel = require('../../models/tco')
    var config = require('../../config')
    var _ = require('underscore')


    getTCOTable = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      var partNumber = req.query.partNumber
      var classType = req.query.classType

      var options = {ascDesc: 'DESC'}
      if (req.query.format=='highcharts')
        options.ascDesc = 'ASC'

      tcoModel.getTCOTableValues(partNumber, options, function(err, docs){
        if (err){
          ret.status = 200
          ret.msg = 'Failed'
          return res.json(ret)
        }else{
          if (req.query.format=='highcharts'){
            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var categories = _.map(docs, function(item, key){
              var dt = item.CALENDAR_YEAR_MONTH.split('_')
              return monthNames[parseInt(dt[1])-1]+' \''+dt[0].toString().substr(2,2)
            })
            var FIVEYEAR_ATCQ = _.pluck(docs, '5YEAR_ATCQ')

            var data = {
                  classType: classType.toUpperCase(), 
                  partNumber:partNumber, 
                  '5YEAR_ATCQ' : FIVEYEAR_ATCQ ,
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

    app.get('/api/tcotable', getTCOTable)
  }
}).call(this)