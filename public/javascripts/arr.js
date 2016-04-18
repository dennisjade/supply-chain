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

      //structure the data for year and month header plotting
      //[{2016:[5,3,1],{2015:[12,5]}]
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
      var tempYearMonth = []
      var returnDefault = []
      _.each(arr, function(item){
        headerYear += '<th class="tg-baqh" colspan="'+ item[Object.keys(item)[0]].length +'">'+Object.keys(item)[0]+'</th>'
        _.each(item[ Object.keys(item)[0] ], function(subitem) {
          headerMonth += '<td class="tg-yw4l">'+subitem+'</td>'
          tempYearMonth.push(Object.keys(item)[0]+'_'+subitem)
          returnDefault.push('<td class="tg-yw4l background-color-green">0.000</td>')
        })
      })

      //[{2016:[02,03]},{2015:[01]}]

      // var sorted = _.groupBy(response.data, 'BUILT_YEAR_MONTH')
      // var rows = ''
      // var currYearProcess = ''
      // var currIBMPN = ''
      // _.each(sorted, function(item, key){
      //   //currYearProcess = item.split('_').trim()[0]
      //   if (currYearProcess!=subitem.BUILD_YEAR || currIBMPN!=subitem.IBMPN){
      //     currYearProcess= subitem.BUILD_YEAR
      //     currIBMPN = subitem.IBMPN
      //     var row = '<tr>'+
      //               '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ item[0].GEO + ' ' + response.data[i].SUPPLIER + '</td>' +
      //               '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ item[0].DRIVENAME + '</td>' +
      //               '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ item[0].IBMPN + '</td>' +
      //               '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ item[0].CAPACITY + '</td>' +
      //               '<td class="tg-yw4l" rowspan="#{ROWSPAN}">'+ item[0].BUILD_YEAR + '</td>' +
      //               '<td class="tg-yw4l">'+ item[0].BUILD_MTH +'</td>' +
      //               '#{RETURNED_VALUES}' +
      //               '<td class="tg-yw4l">'+item[0].VINTAGE_SHIPPED_QTY+'</td>' +
      //               '<td class="tg-yw4l">'+item[0].VINTAGE_RETURNED_QTY+'</td>' +
      //             '</tr>'
      //   }else{
      //     var row += '<tr>'+
      //                 '<td class="tg-yw4l">'+item[key].BUILD_MTH+'</td>' +
      //                 '#{RETURNED_VALUES}' +
      //                 '<td class="tg-yw4l">'+item.VINTAGE_SHIPPED_QTY+'</td>' +
      //                 '<td class="tg-yw4l">'+item.VINTAGE_RETURNED_QTY+'</td>' +
      //                 '</tr>'
      //   }

      //   //loop into the return values
      //   var arrValues = ''
      //   var tempReturnDefault = returnDefault
      //   _.each(item, function(subitem, key){
      //     var yr_mth = subitem.RETURN_YEAR+'_'+subitem.RETURN_MTH
      //     var idx = tempYearMonth.indexOf(yr_mth)
      //     if ( idx >= 0) {
      //       tempReturnDefault[idx] = tempReturnDefault[idx].replace('0.000', subitem.ARR.toFixed(3))
      //       tempReturnDefault[idx] = tempReturnDefault[idx].replace('background-color-green', getArrColor(parseFloat(subitem.ARR)))
      //     }
      //   })

      //   arrValues = tempReturnDefault.join('')

      //   rowTable = row.replace(/#{RETURNED_VALUES}/g, arrValues)
      //   rowTable = rowTable.replace(/#{ROWSPAN}/g, item.length) + rowBuild
      //   rows += rowTablerows += rowTable
      // })


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
                      populateReturnValues(response.data, i, tempYearMonth) +
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
                        populateReturnValues(response.data, counter, tempYearMonth) +
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
                      '<th class="tg-yw4l" rowspan="2">VINTAGE SHIPPED QTY</th>'+
                      '<th class="tg-yw4l" rowspan="2">VINTAGE RETURNED QTY</th>'+
                    '</tr>'+
                    '<tr>'+
                      headerMonth + 
                    '</tr>'
      $(".arrTable").html(table + rows)
    }

    populateReturnValues = function(data, rowPosition, tempYearMonth){
      //create return values for columns
      var arrValues = ''
      for (var arrCounter=0;arrCounter<tempYearMonth.length;arrCounter++){
        var yr_mth = data[rowPosition].RETURN_YEAR+'_'+data[rowPosition].RETURN_MTH
        if (yr_mth == tempYearMonth[arrCounter]){
          arrValues += '<td class="tg-yw4l '+getArrColor(parseFloat(data[rowPosition].ARR))+'">'+data[rowPosition].ARR.toFixed(3)+'</td>'
        }else
          arrValues += '<td class="tg-yw4l background-color-green">0.000</td>'
      }
      return arrValues
    }

    getArrColor = function(arr){
      var color = 'background-color-green'
      if (arr < 2)
        color = 'background-color-green'
      else if(arr < 3)
        color = 'background-color-yellow'
      else if(arr < 4)
        color = 'background-color-orange'
      else if(arr >= 4)
        color = 'background-color-red'

      return color
    }
    errorCallbackArrTable = function(response){}

    $.get('/api/yesno-box?'+params, succesCbArrYesNo).error(errorCallbackArrYesNo)
    $.get('/api/arrtable?'+params, successCbArrTable).error(errorCallbackArrTable)
  }
}).call(this)