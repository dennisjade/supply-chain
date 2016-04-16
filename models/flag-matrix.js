(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getFlagMatrix = function(partNumber, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from FLAG_MATRIX where IBMPN='"+partNumber.toUpperCase()+"'" +
                  //" and CAST((REPLACE(CALENDAR_YEAR_MONTH,'_','-') || '-1') as DATE) = " +                  
                  " ORDER BY "+
                  " CAST((REPLACE(BUILT_YEAR_MONTH,'_','-') || '-1' ) as DATE) DESC, " +
                  " CAST((REPLACE(CALENDER_YEAR_MONTH,'_','-') || '-1' ) as DATE) DESC" + 
                  " FETCH FIRST 1 ROWS ONLY "
      console.log('flag metrix', query)

      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting ARR: ', err);
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
