(function(){
  var request = require('request');
  var analyzeModel = require('../../models/analyze')
  var commonHelper = require('../../helpers/common')

  module.exports =  function(app){

    analyzeSearch = function(req, res){
      var ret = {status:200, msg:'Success', data:null}

      analyzeModel.anaylyzeText(req.body.data, function(err, data){
        if (err){
          ret.status = 500;
          ret.msg = 'Failed analyzing text';
        }else{
          var result = JSON.parse(data)
          console.log(result)
          var partNumber = commonHelper.parsePN(req.body.data)
          console.log('partNumber', partNumber)
          //if partNumber is not found,return an error message
          if (!partNumber && result.top_class.toLowerCase()=='ppm'){
            ret.status = 500
            ret.msg = 'No part number found in the question'
          }else{
            ret.data = {partNumber:partNumber, classType:result.top_class}
          }

        }
        return res.json(ret)
      })
    }

    app.post('/api/analyzeSearch',analyzeSearch);

  }

}).call(this);