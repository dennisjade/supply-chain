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
      var table = '<table class="tg">'+
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

      var rows = ''
      var rowTable = ''
      var currYearProcess = null

      var returnYears = _.pluck(response.data,'RETURN_YEAR')
      var returnYears = _.uniq(returnYears)
      var arr  = []
      _.each(returnYears, function(item){
        var obj = {}
        obj[item]= []
        arr.push(obj)
      })
      var monthArr = []

      for (var i=0; i<response.data.length; i++){
        var key = null
        for(var k=0;k<arr.length;k++){
          if ( _.has(arr[k], response.data[i].RETURN_YEAR) ){
            key = k
            break;
          }
        }

        if (key!=null && arr[key][response.data[i].RETURN_YEAR].indexOf(response.data[i].RETURN_MTH)==-1)
          arr[key][response.data[i].RETURN_YEAR].push(response.data[i].RETURN_MTH)
        
      }

      var headerYear = ''
      _.each(arr, function(item, key){
        headerYear +='<th class="tg-baqh" colspan="'+ item[Object.keys(item)[0]].length +'">'+Object.keys(item)[0]+'</th>'
      })

      console.log('aaaaaa', arr)
      //[{2016:[02,03]},{2015:[01]}]

      for (var i=0; i<response.data.length;i++){
        currYearProcess = response.data[i].BUILD_YEAR
        rowTable = '<tr>'+
                      '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ response.data[i].GEO + ' ' + response.data[i].SUPPLIER + '</td>' +
                      '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ response.data[i].DRIVENAME + '</td>' +
                      '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ response.data[i].IBMPN + '</td>' +
                      '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ response.data[i].CAPACITY + '</td>' +
                      '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ response.data[i].BUILD_YEAR + '</td>' +
                      '<td class="tg-yw4l">'+response.data[i].BUILD_MTH+'</td>' +
                      '<td class="tg-yw4l">1A</td>' +
                      '<td class="tg-yw4l">1B</td>' +
                      '<td class="tg-yw4l">'+response.data[i].VINTAGE_SHIPPED_QTY+'</td>' +
                      '<td class="tg-yw4l">'+response.data[i].VINTAGE_RETURNED_QTY+'</td>' +
                    '</tr>'

        var counter = i
        var rowspan = 1
        var rowBuild= ''
        while (response.data[counter+1] && currYearProcess==response.data[counter+1].BUILD_YEAR) {
          counter ++;
          rowBuild += '<tr>'+
                        '<td class="tg-yw4l">'+response.data[counter].BUILD_MTH+'</td>' +

                        '<td class="tg-yw4l">'+response.data[counter].ARR+'</td>' +
                        '<td class="tg-yw4l">2B</td>' +
                        '<td class="tg-yw4l">'+response.data[counter].VINTAGE_SHIPPED_QTY+'</td>' +
                        '<td class="tg-yw4l">'+response.data[counter].VINTAGE_RETURNED_QTY+'</td>' +
                      '</tr>'
          
          rowspan ++;
        }
        rowTable = rowTable.replace(/#{ROWSPAN}/g, rowspan) + rowBuild
        rows += rowTable
      }
      i = counter
      $(".arrTable").html(table + rows)
    }

    errorCallbackArrTable = function(response){}

    $.get('/api/yesno-box?'+params, succesCbArrYesNo).error(errorCallbackArrYesNo)
    $.get('/api/arrtable?'+params, successCbArrTable).error(errorCallbackArrTable)
  }
}).call(this)