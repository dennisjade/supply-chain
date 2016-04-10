
(function() {

  $("#microphone").on("click", function (e) {
    if (window.hasOwnProperty('webkitSpeechRecognition')) { 
      $("#microphone img").attr("src", '/images/mic2.gif');
      var recognition = new webkitSpeechRecognition(); 
      recognition.continuous = false;
      recognition.interimResults = false;
 
      recognition.lang = "en-US";
      recognition.start();
 
      recognition.onresult = function(e) {
        $("#microphone img").attr("src", '/images/mic1.png');
        document.getElementById('transcript').value  = e.results[0][0].transcript;
        recognition.stop();
        //document.getElementById('homeSearchForm').submit();
      };
 
      recognition.onerror = function(e) {
        recognition.stop();
      } 
    }
  });

}).call(this)