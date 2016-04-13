(function(){

  module.exports =  function(app){
    var request = require('request');
    var analyzeModel = require('../../models/analyze')
    var commonHelper = require('../../helpers/common')

    analyzeSearch = function(req, res){
      var ret = {status:200, msg:'Success', data:null}
      console.log('aaaaaaaaaaaaaaaaa')
      analyzeModel.anaylyzeText(req.body.data, function(err, data){
        if (err){
          ret.status = 500;
          ret.msg = 'Failed analyzing text: '+JSON.stringify(err);
        }else{
          var partNumber = commonHelper.parsePN(req.body.data)
          console.log('partNumber', partNumber)
          //if partNumber is not found,return an error message
          if (!partNumber && data.top_class.toLowerCase()=='ppm'){
            ret.status = 500
            ret.msg = 'No part number found in the question'
          }else{
            ret.data = {partNumber:partNumber, classType:data.top_class}
          }

        }
        return res.json(ret)
      })
    }

    app.post('/api/analyzeSearch',analyzeSearch);

  }

}).call(this);