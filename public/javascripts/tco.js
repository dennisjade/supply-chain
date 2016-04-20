(function(){

  if ($("#tco-page").length > 0){
    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var params ='partNumber='+partNumber+'&classType='+classType

    succesCbTcoYesNo = function(response){
      var html = response.data + '<div class="yesno-button"><button class="btn btn-small btn-success yes-tco">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger no-tco">No</button></div>'
      $(".yesno-tco").html(html);
      textToSpeech(response.data);
    }
    errorCallbackTcoYesNo = function(response){}

    successCbTcoTable = function(response){
      var table = '<table class="tg">'+
                    '<tr>'+
                      '<th class="tg-031e">CAPaCITY</th>'+
                      '<th class="tg-031e">SUPPLIER</th>'+
                      '<th class="tg-031e">DRIVE FAMILY</th>'+
                      '<th class="tg-031e">IBMPN</th>'+
                      '#{YEAR_HEADER}'+
                    '</tr>'+
                    '<tr>'+
                      '<td class="tg-031e">'+response.data[0]['CAPACITY']+'</td>'+
                      '<td class="tg-031e">'+response.data[0]['SUPPLIER']+'</td>'+
                      '<td class="tg-031e">'+response.data[0]['DRIVENAME']+'</td>'+
                      '<td class="tg-031e">'+response.data[0]['IBMPN']+'</td>'+
                      '#{ATCQ}'+
                    '</tr>' +
                  '</table>'

      var yearHeader = ''
      var atcq = ''
      for(var i=0;i<response.data.length;i++){
        yearHeader += '<th class="tg-031e">'+response.data[i].CALENDAR_YEAR_MONTH+'</th>'
        atcq += '<td class="tg-031e">'+response.data[i]['5YEAR_ATCQ'].toFixed(2)+'</td>'
      }

      table = table.replace('#{YEAR_HEADER}', yearHeader)
      table = table.replace('#{ATCQ}', atcq)
      $(".tcoTable").html(table)
    }

    errorCallbackTcoTable = function(response){}

    $.get('/api/yesno-box?'+params, succesCbTcoYesNo).error(errorCallbackTcoYesNo)
    $.get('/api/tcotable?'+params, successCbTcoTable).error(errorCallbackTcoTable)

    $('.yesno-tco').on('click', '.yes-tco', function(response){
      $(".yesno-tco").html('Done!')
      textToSpeech('Done!')
    })

    successCallbackNoTCO = function(response){
      $(".yesno-tco").html(response.data)
      textToSpeech(response.data)
    }

    $('.yesno-tco').on('click', '.no-tco', function(){
      $.get('/api/no-tco?'+params, successCallbackNoTCO)
    })

  }
}).call(this)