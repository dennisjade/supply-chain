(function(){
  var request = require('request')
  var config = require('../config')

  module.exports.anaylyzeText = function (text, callback){
    var params = {method:'GET',rejectUnauthorized:false}
    var url= 'https://'+config.getNLACreds().username+':'+config.getNLACreds().password+'@'+config.getNLACreds().uri+'?text='+text

    request(url, params, function(err, response, body){
      if (err)
        callback(err, null)
      else
        callback(null, body)
    })
  }


}).call(this)