(function() {
  module.exports = exports = props = {};
  var vcap = process.env.VCAP_SERVICES || '{}';

  vcap = JSON.parse(vcap);

  props.NLACreds = {
      username: process.env.NLA_username || 'ab4fe34c-8d95-4916-a5a7-b98775b4545b', 
      password:process.env.NLA_password || 'Zg75TE5oXY80', 
      uri: process.env.NLA_uri || 'gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/cd6394x53-nlc-919/classify'
    }

  props.yesnoMsg = process.env.yesnoMsg

  props.dbConnString = process.env.DB

}).call(this)