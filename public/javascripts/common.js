
(function() {

  textToSpeech = function(text){
    var audio = new Audio();

    audio.src = '/api/text-to-speech/synthesize?text=' + encodeURIComponent(text);
    // let the browser buffer the audio before playing
    audio.play();
  }

  $("#microphone").on("click", function (e) {
    if (window.hasOwnProperty('webkitSpeechRecognition')) { 
      
      $("#microphone img").attr("src", '/images/mic2.gif');
      $("#response-message").html('');

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
    $("#response-message").html('');
    var l = Ladda.create(this);
    var data = $("#transcript").val()

    l.start();

    $.post("/api/analyzeSearch", { data : data }, function(response){
        l.stop();
        if (response.status==200)
          loadSearch(response.data)
        else
          $("#response-message").html(response.msg)
        return false;
      }, "json")
    //.always(function() { l.stop(); });
    
    
  })

  loadSearch= function(data){
    $("input[name=classType]").val(data.classType);
    $("input[name=partNumber]").val(data.partNumber);
    $("input[name=vintage]").val(data.vintage);
    $("#submitSearchResult").submit()
  }

  $('#sbmt').on("click", function(e) {
        var users = [
          "gaguigc",
          "chanab",
          "angak",
          "tohpjb",
          "neohk",
          "js9m",
          "jfritz",
          "lowlgj",
          "kdore",
          "luliu",
          "corralmg",
          "matt",
          "bobedge",
          "elhoushy",
          "vivekp",
          "glogow",
          "sgan",
          "jamie"
        ];
        var pass = "1234";
        var psw = document.querySelector('#psw').value;
        var bvalid = false;
        if ((psw) && (psw == pass)) {
            var user = document.querySelector('#usrname').value;
            if ($.inArray(user.toLowerCase(), users) > -1) {
                document.cookie ='username='+ user
                bvalid = true;
                window.open("/home", '_self');
            }
        }
        if (!bvalid) alert("Invalid login");
        return false;
  });

}).call(this)