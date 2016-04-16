(function(){

  if ($("#overall-page").length > 0){
    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var params ='partNumber='+partNumber+'&classType='+classType

    succesCbOverallYesNo = function(response){
      var html = response.data + '<div class="yesno-button"><button class="btn btn-small btn-success">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger">No</button></div>'
      $(".yesno-overall").html(html);
      textToSpeech(response.data);
    }
    errorCallbackOverallYesNo = function(response){}

    $.get('/api/yesno-box?'+params, succesCbOverallYesNo).error(errorCallbackOverallYesNo)
  }
}).call(this)