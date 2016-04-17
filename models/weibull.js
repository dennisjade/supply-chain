(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getWeibull = function(partNumber, vintage, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from WEIBULL where IBMPN='"+partNumber.toUpperCase()+"'" +
                  " and BUILT_YEAR_MONTH='" + vintage + "'"
                  //" ORDER BY "+
                  //" CAST((REPLACE(BUILT_YEAR_MONTH,'_','-') || '-1' ) as DATE) DESC " +
                  " FETCH FIRST 1 ROWS ONLY "
      console.log('weibull', query)

      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting WEIBULL: ', err);
          callback(err,null)
        } else {
          console.log(err, rows, docs[0])
          callback(null, rows[0])
        }
      });

    } catch(e){
      console.log(e.message);
    }
  }

}).call(this)
