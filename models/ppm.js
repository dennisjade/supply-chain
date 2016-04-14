(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getPPMTableValues = function(partNumber, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var currDate  = new Date()
      var year = currDate.getFullYear()
      var month = currDate.getMonth()+2 //+2because getMonth start with 0 and  we want to include the current month in the display

      var tempMonth = currDate.getMonth() - 12 //get only the last
      if (tempMonth<=0){
        year -= 1
      }
      var query= "select * from PPM where IBMPN='"+partNumber.toUpperCase()+"'" +
                  " and (PERIOD_MONTH>="+month+' and PERIOD_YEAR>='+year+')'
      console.log('pppm table', query)
      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting PPM: ', err);
          callback(err,null)
        } else {
          //console.log(err, rows, docs)
          callback(null, rows)
        }
      });

    } catch(e){
      console.log(e.message);
    }
  }

}).call(this)

