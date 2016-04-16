(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getWEIBULLTableValues = function(partNumber, builtYearMonth, options, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from WEIBULL_FULLDATA where IBMPN='"+partNumber.toUpperCase()+"'" +
                  " and BUILT_YEAR_MONTH = '" + builtYearMonth + "' " +
                  //" and CAST((REPLACE(BUILT_YEAR_MONTH,'_','-') || '-1' ) as DATE) >= current date - 12 months " +
                  " ORDER BY POH " + options.ascDesc
      console.log('weibull table', query)

      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting TCO: ', err);
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

