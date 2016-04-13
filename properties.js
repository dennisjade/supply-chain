(function() {
  module.exports = exports = props = {};
  var vcap = process.env.VCAP_SERVICES || '{}';

  vcap = JSON.parse(vcap);

  props.NLACreds = {
      url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
      username: process.env.NLA_username || "ab4fe34c-8d95-4916-a5a7-b98775b4545b",
      password: process.env.NLA_password || "Zg75TE5oXY80",
      version: 'v1'
    }

  props.yesnoMsg = process.env.yesnoMsg

  props.dbConnString = process.env.DB

  props.ttsConfig = {
      version: 'v1',
      url: 'https://stream.watsonplatform.net/text-to-speech/api',
      username: process.env.TTS_username || "ca4ea55d-9745-48dc-a4f7-f6b3ef1eb9d3",
      password: process.env.TTS_password || "XtC6qy1zHA1T",
    }

}).call(this)