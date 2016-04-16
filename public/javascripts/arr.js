(function(){

  if ($("#arr-page").length > 0){
    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var params ='partNumber='+partNumber+'&classType='+classType

    succesCbArrYesNo = function(response){
      var html = response.data + '<div class="yesno-button"><button class="btn btn-small btn-success">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger">No</button></div>'
      $(".yesno-arr").html(html);
      textToSpeech(response.data);
    }
    errorCallbackArrYesNo = function(response){}

    successCbArrTable = function(response){
      var arrTable = '<table class="tg">'+
                        '<tr>'+
                          '<th class="tg-yw4l" rowspan="2">GEO Supplier</th>'+
                          '<th class="tg-yw4l" rowspan="2">Family</th>'+
                          '<th class="tg-yw4l" rowspan="2">IBMPN</th>'+
                          '<th class="tg-yw4l" rowspan="2">Capacity</th>'+
                          '<th class="tg-yw4l" rowspan="2">Build Year</th>'+
                          '<th class="tg-yw4l" rowspan="2">Build Month</th>'+
                          '<th class="tg-baqh" colspan="2">2015</th>'+
                          '<th class="tg-yw4l" rowspan="2">VINTAGE_SHIPPED_QTY</th>'+
                          '<th class="tg-yw4l" rowspan="2">VINTAGE_RETURNED_QTY</th>'+
                        '</tr>'+
                        '<tr>'+
                          '<td class="tg-yw4l">5</td>'+
                          '<td class="tg-yw4l">1</td>'+
                        '</tr>'

      var rowTable = ''
      var currYearProcess = null

      for (var i=0; i<response.data.length;i++){
        currYearProcess = response.data[i].BUILD_YEAR
        rowTable = '<tr>'+
                      '<td class="tg-yw4l" rowspan="3">'+ response.data[i].GEO + ' ' + response.data[i].SUPPLIER + '</td>' +
                      '<td class="tg-yw4l" rowspan="3">'+ response.data[i].DRIVENAME + '</td>' +
                      '<td class="tg-yw4l" rowspan="3">'+ response.data[i].IBMPN + '</td>' +
                      '<td class="tg-yw4l" rowspan="3">'+ response.data[i].CAPACITY + '</td>' +
                      '<td class="tg-yw4l" rowspan="3">'+ response.data[i].BUILD_YEAR + '</td>' +


                      '<td class="tg-yw4l">'+response.data[i].RETURN_YEAR+'</td>' +
                      '<td class="tg-yw4l">1A</td>' +
                      '<td class="tg-yw4l">1B</td>' +

                      '<td class="tg-yw4l">VINTAGE_SHIPPED_QTY</td>' +
                      '<td class="tg-yw4l">VINTAGE_RETURNED_QTY</td>' +
                    '</tr>'

                      var counter = i+1
                      var rowBuild= ''
                      while (response.data[counter] && currYearProcess==response.data[counter].BUILD_MONTH) {
                        rowBuild = '<tr>'+
                                      '<td class="tg-yw4l">'+response.data[counter].BUILD_MONTH+'</td>'
                                      '<td class="tg-yw4l">2A</td>'
                                      '<td class="tg-yw4l">2B</td>'
                                      '<td class="tg-yw4l">'+response.data[counter].VINTAGE_SHIPPED_QTY+'</td>'
                                      '<td class="tg-yw4l">'+response.data[counter].VINTAGE_RETURNED_QTY+'</td>'
                                    '</tr>'
                        counter ++;
                      }
      }

      $(".arrTable").html('')
    }

    errorCallbackArrTable = function(response){}

    $.get('/api/yesno-box?'+params, succesCbArrYesNo).error(errorCallbackArrYesNo)
    $.get('/api/arrtable?'+params, successCbArrTable).error(errorCallbackArrTable)
  }
}).call(this)