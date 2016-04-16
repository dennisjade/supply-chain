
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
    $("#submitSearchResult").submit()
  }

  if ($("#ppm-toc-weibull").length > 0){
    computeStartMonthYear = function(){
      var currDate  = new Date()
      var year = currDate.getFullYear()
      var month = currDate.getMonth()+2

      var tempMonth = currDate.getMonth() - 12 //get only the last
      if (tempMonth<=0){
        year -= 1
      }

      return {month: month, year:year}
    }

    successCallback = function(response){
      var html = response.data + '<div class="yesno-button"><button class="btn btn-small btn-success">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger">No</button></div>'
      $(".yesno-ppm").html(html);
      textToSpeech(response.data);
    }
    
    errorCallback = function(response){

    }

    successCallbackPPMTable = function(response){
      var startMonthYear = computeStartMonthYear();

      var ppmTable = ''
      var totalMonths = response.data.length
      var yearHeader = '<th colspan="13" class="tg-yw4l">'+startMonthYear.year+'</th>'
      var monthsHeader=''
      var shippedQty='<td class="tg-yw4l">'+(response.data[0]?response.data[0].DRIVEFAMILY:'N/A')+'</td>'+
                      '<td class="tg-yw4l">'+(response.data[0]?response.data[0].IBMPN:'N/A')+'</td>'+
                      '<td class="tg-yw4l">Shipped Qty</td>'
      var returnQty='<td class="tg-yw4l"></td>'+
                    '<td class="tg-yw4l"></td>'+
                    '<td class="tg-yw4l">Return Qty</td>'
      var cummShippedQty='<td class="tg-yw4l"></td>'+
                    '<td class="tg-yw4l"></td>'+
                    '<td class="tg-yw4l">Cumm.Shipped Qty</td>'
      var ppm= '<td class="tg-yw4l"></td>'+
              '<td class="tg-yw4l"></td>'+
              '<td class="tg-yw4l">PPM</td>'

      var monthCounter = startMonthYear.month
      var yearCounter = startMonthYear.year
      for(var i=0;i<12;i++){
        var record = _.find(response.data, function(item){return parseInt(item.PERIOD_MONTH)==monthCounter && parseInt(item.PERIOD_YEAR)==yearCounter})

        monthsHeader += '<td class="tg-yw4l">'+monthCounter+'</td>'
        shippedQty += '<td class="tg-lqy6">'+(record?record.SHIPPED_QTY:0)+'</td>'
        returnQty += '<td class="tg-lqy6">'+(record?record.RETURN_QTY:0)+'</td>'
        cummShippedQty += '<td class="tg-lqy6">'+(record?record.cum_SHIPPED_QTY:0)+'</td>'
        ppm += '<td class="tg-l2oz">'+(record?record.PPM:0)+'</td>'

        //we increment the month and year and validate the month if it passes 12
        monthCounter++;
        if (monthCounter>12){
          yearHeader = '<th colspan="'+(i+1)+'" class="tg-yw4l">'+yearCounter+'</th><th colspan="'+(11-1)+'" class="tg-yw4l">'+(yearCounter+1)+'</th>'
          monthCounter=1
          yearCounter++
        }
      }

      ppmTable += '<table class="tg"> ' +
                    '<tr>'+
                      '<th colspan="3" rowspan="2" class="tg-yw4l"></th>'+
                      yearHeader +
                    '</tr>' +
                    '<tr>'+monthsHeader+'</tr>'+
                    '<tr>'+shippedQty+'</tr>'+
                    '<tr>'+returnQty+'</tr>'+
                    '<tr>'+cummShippedQty+'</tr>'+
                    '<tr>'+ppm+'</tr>'+
                  '</table>'
      $(".ppmTable").html(ppmTable)
    }

    errorCallbackPPMTable = function(response){

    }

    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var params ='partNumber='+partNumber+'&classType='+classType
    $.get('/api/yesno-box?'+params, successCallback).error(errorCallback)
    $.get('/api/ppmtable?'+params, successCallbackPPMTable).error(errorCallbackPPMTable)
  }

}).call(this)