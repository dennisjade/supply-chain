(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getFlagMatrix = function(partNumber, vintage, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      getFlagMetrixVintage= function(partNumber, vintage, cb) {
        var query= "select * from FLAG_MATRIX where IBMPN='"+partNumber.toUpperCase()+"'" +
                    (vintage?" and BUILT_YEAR_MONTH= '" + vintage + "'":'') +
                    " ORDER BY "+
                    " CAST((REPLACE(BUILT_YEAR_MONTH,'_','-') || '-1' ) as DATE) DESC, " +
                    " CAST((REPLACE(CALENDER_YEAR_MONTH,'_','-') || '-1' ) as DATE) DESC" + 
                    " FETCH FIRST 1 ROWS ONLY "
        console.log('flag metrix', query)

        global.dbConn.query(query, function (err, rows, docs) {
          if (err) {
            console.log('Error getting ARR: ', err);
            cb(err,null)
          } else {
            //console.log(err, rows, docs[0])
            cb(null, rows)
          }
        });
      }

      var data = getFlagMetrixVintage(partNumber, vintage, function(err, data){
        console.log(data, data.length)
        if (data.length==0){
          //get latest instead
          getFlagMetrixVintage(partNumber, '', function(err, data){
            callback(err, data[0])
          })
        }else{
          callback(err, data[0])
        }
      })
      

    } catch(e){
      console.log(e.message);
    }
  }

}).call(this)
