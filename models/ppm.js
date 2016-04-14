(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getPPMTableValues = function(partNumber, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from PPM where IBMPN='"+partNumber.toUpperCase()+"'" +
                  " and CAST((PERIOD_YEAR || '-' || PERIOD_MONTH || '-1' ) as DATE) >= current date - 12 months"
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

