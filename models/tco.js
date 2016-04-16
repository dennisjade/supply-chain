(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getTCOTableValues = function(partNumber, options, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from TCO where IBMPN='"+partNumber.toUpperCase()+"'" +
                  " and CAST((REPLACE(CALENDAR_YEAR_MONTH,'_','-') || '-1' ) as DATE) >= current date - 12 months " +
                  " ORDER BY CAST((REPLACE(CALENDAR_YEAR_MONTH,'_','-') || '-1' ) as DATE) " + options.ascDesc
      console.log('tco table', query)

      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting TCO: ', err);
          callback(err,null)
        } else {
          console.log(err, rows, docs)
          callback(null, rows)
        }
      });

    } catch(e){
      console.log(e.message);
    }
  }

}).call(this)

