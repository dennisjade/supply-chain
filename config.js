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

  config.yesnoMsg = props.yesnoMsg || "Hi #{username}, \n\n Here is the #{classType} performance for #{partNumber} and the trend seems to be #{trend1} and #{trend2}. It's ARR got #{alertsCount} Alerts. Do you want to check its performance by Vintage?"

  config.dbConnString = props.dbConnString || "DATABASE=SQLDB;HOSTNAME=75.126.155.153;PORT=50000;PROTOCOL=TCPIP;UID=user15506;PWD=SAIL2RSdn8Z3;"
}).call(this)