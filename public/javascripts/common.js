
(function() {

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

    $.post("/api/analyzeSearch", 
        { data : data },
      function(response){
        if (response.status==200)
          loadSearch(response.data)
        else
          $("#response-message").html(response.msg)
      }, "json")
    .always(function() { l.stop(); });
    
    return false;
  })

  loadSearch= function(data){
    $("input[name=classType]").val(data.classType);
    $("input[name=partNumber]").val(data.partNumber);
    $("#submitSearchResult").submit()
  }

  if ($("#ppm-toc-weibull").length > 0){
    successCallback = function(response){
      $(".yesno-box").html(response.data)
    }
    errorCallback = function(response){

    }

    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var params ='partNumber='+partNumber+'&classType='+classType
    $.get('api/yesno-box?'+params, successCallback).error(errorCallback)
  }

}).call(this)