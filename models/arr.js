(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getARRTableValues = function(partNumber, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from ARR where IBMPN='"+partNumber.toUpperCase()+"'" +
                  " and CAST((REPLACE(BUILT_YEAR_MONTH,'_','-') || '-1' ) as DATE) >= current date - 12 months " +
                  " ORDER BY CAST((REPLACE(BUILT_YEAR_MONTH,'_','-') || '-1' ) as DATE) DESC"
      console.log('arr table', query)

      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting ARR: ', err);
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
