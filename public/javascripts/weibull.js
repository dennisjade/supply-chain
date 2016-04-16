(function(){

  if ($("#weibull-page").length > 0){
    var partNumber= $('input[name=partNumber]').val()
    var classType = $('input[name=classType]').val()
    var vintage = $('input[name=vintage]').val()
    var params ='partNumber='+partNumber+'&classType='+classType+'&vintage='+vintage

    succesCbTcoYesNo = function(response){
      var html = response.data + '<div class="yesno-button"><button class="btn btn-small btn-success">Yes</button>&nbsp;&nbsp;&nbsp;<button class="btn btn-small btn-danger">No</button></div>'
      $(".yesno-weibull").html(html);
      textToSpeech(response.data);
    }
    errorCallbackTcoYesNo = function(response){}

    successCbWeibullTable = function(response){
      var table = ''
      if (response.status==200 && response.data){
        table = '<table class="tg">'+
                  '<tr>'+
                    '<th class="tg-031e">Supplier</th>'+
                    '<th class="tg-031e">Drive Name</th>'+
                    '<th class="tg-031e">IBMPN</th>'+
                    '<th class="tg-031e">Build Year Month</th>'+
                    '<th class="tg-031e">Beta</th>'+
                    '<th class="tg-031e">Eta</th>'+
                    '<th class="tg-031e">POH</th>'+
                    '<th class="tg-031e">Prediction</th>'+
                    '<th class="tg-031e">Failure Rate</th>'+
                    '<th class="tg-031e">Vintage Shipped Qty</th>'+
                    '<th class="tg-031e">Cumm. Returned Qty</th>'+
                  '</tr>'

        var rows = ''
        for (var i=0;i<response.data.length;i++){
          rows += '<tr>'
          if (i==0){
            rows +=  '<td class="tg-031e valign-top" rowspan="#{ROWSPAN}">'+response.data[i]['SUPPLIER']+'</td>'+
                    '<td class="tg-031e valign-top" rowspan="#{ROWSPAN}">'+response.data[i]['DRIVENAME']+'</td>'+
                    '<td class="tg-031e valign-top" rowspan="#{ROWSPAN}">'+response.data[i]['IBMPN']+'</td>'+
                    '<td class="tg-031e valign-top" rowspan="#{ROWSPAN}">'+response.data[i]['BUILT_YEAR_MONTH']+'</td>'+
                    '<td class="tg-031e valign-top" rowspan="#{ROWSPAN}">'+response.data[i]['Beta']+'</td>'+
                    '<td class="tg-031e valign-top" rowspan="#{ROWSPAN}">'+response.data[i]['Eta']+'</td>'
          }
          rows += '<td class="tg-031e">'+response.data[i]['POH']+'</td>'+
                  '<td class="tg-031e">'+response.data[i]['Prediction'].toFixed(3)+'</td>'+
                  '<td class="tg-031e">'+(response.data[i]['Failure Rate']*100).toFixed(3)+'%</td>'+
                  '<td class="tg-031e">'+response.data[i]['VINTAGE_SHIPPED_QTY_Max']+'</td>'+
                  '<td class="tg-031e">'+response.data[i]['VINTAGE_RETURNED_QTY_Max']+'</td>'+
                '</tr>'
        }
        table += rows.replace(/#{ROWSPAN}/g,response.data.length)
      }

      $(".weibullTable").html(table)
    }

    errorCallbackWeibullTable = function(response){}

    $.get('/api/yesno-box?'+params, succesCbTcoYesNo).error(errorCallbackTcoYesNo)
    $.get('/api/weibulltable?'+params, successCbWeibullTable).error(errorCallbackWeibullTable)
  }
}).call(this)