(function(){
  var ibmdb = require("ibm_db");
  var config= require("../config");
  var moment= require("moment")


  module.exports.getNoReplyActionTableValues = function(flag, callback){
    try{
      if (!global.dbConn.connected)
        global.dbConn = ibmdb.openSync(config.dbConnString);

      var query= "select * from NO_REPLY_ACTION where FLAG="+flag
      console.log('no-reply-action table', query)

      global.dbConn.query(query, function (err, rows, docs) {
        if (err) {
          console.log('Error getting no-reply-action: ', err);
          callback(err,null)
        } else {
          console.log(err, rows, docs)
          callback(null, rows[0])
        }
      });

    } catch(e){
      console.log(e.message);
    }
  }

}).call(this)

