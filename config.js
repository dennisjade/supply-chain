( function(){
  var _ = require("underscore");
  var props = {};

  try {
    props = require('./properties');
  } catch (_error) {
    console.log('>>>', _error);
    props = require('../properties');
  }

  module.exports = exports = config = {};

  /*Natural Language Analyzer*/
  config.getNLACreds = function() {
    return _.extend({
              url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
              username: "ab4fe34c-8d95-4916-a5a7-b98775b4545b",
              password: "Zg75TE5oXY80",
              version: 'v1'
            }, props.NLACreds);
  }
  
  config.getTTSCreds = function(){
    return _.extend({
              version: 'v1',
              url: 'https://stream.watsonplatform.net/text-to-speech/api',
              username: "ca4ea55d-9745-48dc-a4f7-f6b3ef1eb9d3",
              password: "XtC6qy1zHA1T",
            }, props.ttsConfig)
  }

  config.yesnoPPMMsg = props.yesnoPPMMsg || "Hi #{username}, \n\n Here is the #{classType} table for IBMPN #{partNumber}. \n#{trend1} and the trend is #{trend2}. \n\nThere are #{alertsCount} ARR alerts. \n\nDo you want to check its performance by Vintage?"
  config.yesnoARRMsg = props.yesnoARRMsg || "Hi #{username}, \n\n Here is the #{classType} performance for IBMPN #{partNumber}. \nIt has #{alertsCount} alerts. Quality Index is #{qualityIndex}, rank at #{rank} position. \n\n Do you want to notify technical support team?"
  config.yesnoTCOMsg = props.yesnoTCOMsg || "Hi #{username}, \n\n Here is the #{classType} performance for IBMPN #{partNumber}.\n\n #{bucketDesc} #{flagDesc} \n\n Do you want to notify technical support team?"
  config.yesnoWEIBULLMsg = props.yesnoWEIBULLMsg || "Hi #{username}, \n\n Here is the #{classType} prediction for IBMPN #{partNumber}, Vintage #{vintageNumber}. \n\n The 5-year projection for this IBMPN and vintage is #{prediction}. \n\n Do you want to notify technical support team?"
  config.yesnoOVERALLMsg = props.yesnoOVERALLMsg || "Hi #{username}, \n\n Below is the #{classType} for IBMPN #{partNumber}, \n Vintage #{vintageNumber}. \n\n #{summaryRemarks} \n#{arrDesc} \n #{ppmDesc} \n#{tcoBucketDescAndFlag} \n#{fiveYrBucketDesc} \n\n Do you want to notify technical support team?"

  config.dbConnString = props.dbConnString || "DATABASE=SQLDB;HOSTNAME=75.126.155.153;PORT=50000;PROTOCOL=TCPIP;UID=user15506;PWD=SAIL2RSdn8Z3;"
}).call(this)