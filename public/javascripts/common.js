
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

  $(".makeSearch").on("click", function (e){
    //e.preventDefault();
    var l = Ladda.create(this);
    var data = $("#transcript").val()

    l.start();

    $.post("/api/analyzeSearch", 
        { data : data },
      function(response){
        loadSearch(response.data)
      }, "json")
    .always(function() { l.stop(); });
    
    return false;
  })

  loadSearch= function(pageType){
    $("input[name=classType]").val(pageType);
    $("#submitSearchResult").submit()
  }

}).call(this)