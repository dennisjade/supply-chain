(function(){

  if ($("#overall-page").length > 0){
    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var vintage = $('input[name=vintage]').val()
    var params ='partNumber='+partNumber+'&classType='+classType+'&vintage='+vintage

    succesCbOverallYesNo = function(response){
      var html = response.data + '<div class="yesno-button"><button class="btn btn-small btn-success yes-overall">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger no-overall">No</button></div>'
      $(".yesno-overall").html(html);
      textToSpeech(response.data);
    }
    errorCallbackOverallYesNo = function(response){}

    $.get('/api/yesno-box?'+params, succesCbOverallYesNo).error(errorCallbackOverallYesNo)

    $('.yesno-overall').on('click', '.yes-overall', function(response){
      $(".yesno-overall").html('Done!')
    })

    successCallbackNoOverall = function(response){
      $(".yesno-overall").html(response.data)
    }

    $('.yesno-overall').on('click', '.no-overall', function(){
      $.get('/api/no-overall'+params, successCallbackNoOverall)
    })

  }
}).call(this)