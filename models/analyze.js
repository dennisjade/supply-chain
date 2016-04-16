(function(){
  var request = require('request')
  var config = require('../config')
  var watson  = require('watson-developer-cloud')

  //lets initialize ahead of time the analyzer
  var natural_language_classifier = watson.natural_language_classifier(config.getNLACreds());

  module.exports.anaylyzeText = function (text, callback){
    natural_language_classifier.classify({
      text: text,
      classifier_id: 'f1704ex55-nlc-3949' },
      function(err, response) {
        if (err){
          console.log('Error on analyzing text ', JSON.stringify(err))
          callback(err, null)
        }else{
          console.log('anaylyzer result: ', err, response)
          callback(null, response)
        }
    });
  }


}).call(this)