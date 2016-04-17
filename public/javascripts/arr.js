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

      //plot the return year and month header
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
      var headerMonth = ''
      var totalHeaderMonths = 0
      _.each(arr, function(item){
        headerYear += '<th class="tg-baqh" colspan="'+ item[Object.keys(item)[0]].length +'">'+Object.keys(item)[0]+'</th>'
        totalHeaderMonths += item[ Object.keys(item)[0] ].length
        _.each(item[ Object.keys(item)[0] ], function(subitem) {
          headerMonth += '<td class="tg-yw4l">'+subitem+'</td>'
        })
      })

      console.log('aaaaaa', arr)
      //[{2016:[02,03]},{2015:[01]}]

      //start looping the records
      var rows = ''
      var rowTable = ''
      var currYearProcess = null
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
          var arrValue = ''
          for (var arrCounter=0;arrCounter<totalHeaderMonths;arrCounter++){
            arrValue += '<td class="tg-yw4l">'+response.data[counter].ARR+'</td>'
          }

          counter ++;
          rowBuild += '<tr>'+
                        '<td class="tg-yw4l">'+response.data[counter].BUILD_MTH+'</td>' +
                        arrValue +
                        '<td class="tg-yw4l">'+response.data[counter].VINTAGE_SHIPPED_QTY+'</td>' +
                        '<td class="tg-yw4l">'+response.data[counter].VINTAGE_RETURNED_QTY+'</td>' +
                      '</tr>'
          
          rowspan ++;
        }
        i = counter
        rowTable = rowTable.replace(/#{ROWSPAN}/g, rowspan) + rowBuild
        rows += rowTable
      }
      //end looping the records

      var table = '<table class="tg">'+
                    '<tr>'+
                      '<th class="tg-yw4l" rowspan="2">GEO Supplier</th>'+
                      '<th class="tg-yw4l" rowspan="2">Family</th>'+
                      '<th class="tg-yw4l" rowspan="2">IBMPN</th>'+
                      '<th class="tg-yw4l" rowspan="2">Capacity</th>'+
                      '<th class="tg-yw4l" rowspan="2">Build Year</th>'+
                      '<th class="tg-yw4l" rowspan="2">Build Month</th>'+
                      headerYear +
                      '<th class="tg-yw4l" rowspan="2">VINTAGE_SHIPPED_QTY</th>'+
                      '<th class="tg-yw4l" rowspan="2">VINTAGE_RETURNED_QTY</th>'+
                    '</tr>'+
                    '<tr>'+
                      headerMonth + 
                    '</tr>'
      $(".arrTable").html(table + rows)
    }

    errorCallbackArrTable = function(response){}

    $.get('/api/yesno-box?'+params, succesCbArrYesNo).error(errorCallbackArrYesNo)
    $.get('/api/arrtable?'+params, successCbArrTable).error(errorCallbackArrTable)
  }
}).call(this)