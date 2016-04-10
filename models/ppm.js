(function(){
  var ibmdb = require("ibm_db"),
      connString = "DATABASE=SQLDB;HOSTNAME=75.126.155.153;PORT=50000;PROTOCOL=TCPIP;UID=user15506;PWD=SAIL2RSdn8Z3;";


  module.exports.test = function() {
    try {
        var conn = ibmdb.openSync(connString);
        conn.query("select * from PPM fetch first 10 rows only", function (err, rows, moreResultSets) {
            if (err) {
                console.log('Error getting PPM: ',err);
            } else {
              console.log(rows);
            }
            conn.close();   
        });
    } catch (e) {
        console.log(e.message);
    }
  }
  
}).call(this)