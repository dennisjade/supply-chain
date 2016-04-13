(function(){
  var watson  = require('watson-developer-cloud')
  var config = require('../../config')
  var tts     = watson.text_to_speech(config.getTTSCreds());

  module.exports =  function(app){

    synthesize = function(req, res){
      // create an audio stream
      var audioStream = tts.synthesize({
        text: req.query.text,
        accept: req.headers.accept // let the client's browser choose what format the audio is sent in
      });

      // send the audio stream to the speech to text service and extract word timings from the results
      getTimings = new Promise(function(resolve, reject) {
        stt.recognize({
          audio: audioStream,
          timestamps: true,
          content_type: 'audio/ogg; codec=opus' // todo: set this pragmatically based on audio stream's content type
        }, function(err, data) {
          console.log(err, data);
          if (err) {
            return reject(err);
          }
          var wordTimings = data.results.reduce(function(prev, result) {
            return prev.concat(result.alternatives[0].timestamps)
          }, []);
          resolve(wordTimings);
        });
      });

      // also send the audio stream to the client for playback
      audioStream.pipe(res);

      // you could additionally pipe the audio to a file if you wanted to save it for later
      // audioStream.pipe(fs.createWriteStream('./my-audio-fille.{wav|ogg|flac}'));
        }

        app.get('/api/text-to-speech/synthesize', synthesize)

  }
}).call(this)