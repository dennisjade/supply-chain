(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")
      
      //connString = "DATABASE=SQLDB;HOSTNAME=75.126.155.153;PORT=50000;PROTOCOL=TCPIP;UID=user15506;PWD=SAIL2RSdn8Z3;";

  module.exports.getTrends = function(partNumber, callback) {
    try {

        if (!global.dbConn.connected)
          global.dbConn = ibmdb.openSync(config.dbConnString);

        var currDate = new Date()
        var month = currDate.getMonth()-1 //minus 2 because we dont have data for the current months
        var year = currDate.getFullYear()
        var query = "select PPM_FLAG, PPM_FLAG_TEXT, TREND_TEXT from PPM_TREND where" +
                    " IBMPN='"+partNumber.toUpperCase()+"' and CAST(PERIOD_MONTH as INTEGER)="+month+" and CAST(PERIOD_YEAR as INTEGER)="+year+
                    " fetch first rows only"
        console.log('gettrend', query)
        global.dbConn.query(query, function (err, rows, docs) {
            if (err) {
              console.log('Error getting PPM_TREND: ', err);
              callback(err,null)
            } else {
              //console.log(err, docs)
              callback(null, rows[0])
            }
        });
    } catch (e) {
      console.log(e.message);
    }
  }
  
}).call(this)