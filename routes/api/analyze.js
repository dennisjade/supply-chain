(function(){
  var request = require('request');

  module.exports =  function(app){

    analyzeSearch = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      //put this in a config
      var username= "ab4fe34c-8d95-4916-a5a7-b98775b4545b"
      var password= "Zg75TE5oXY80"

      var params = {method:'GET',rejectUnauthorized:false}
      var url= 'https://'+username+':'+password+
        '@gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/cd6394x53-nlc-919/classify'+
        '?text='+req.body.data

      console.log('aaaaaaaa', params, url)
      request(url, params, function(err, response, body){
        if (err){
          ret.status = 500;
          ret.msg = 'Failed';
        }else{
          var result = JSON.parse(body)
          console.log(result.top_class)
          ret.data = result.top_class
        }
        return res.json(ret)
      })
      
    }

    app.post('/api/analyzeSearch',analyzeSearch);

  }

}).call(this);