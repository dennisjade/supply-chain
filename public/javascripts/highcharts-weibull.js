
(function(){

  if ($("#weibull-page").length > 0){
    var classType = $("input[name=classType]").val();
    var partNumber = $("input[name=partNumber]").val();
    var vintage = $("input[name=vintage]").val();

    var options = {
          chart: {
              renderTo: 'container-weibull'
          },
          title: {
              text: 'Chart'
          },
          subtitle: {
              text: '',
          },
          xAxis: [{
              categories: [],
              labels: {rotation: -45},
              title: {text: 'POH'}
          }],
          yAxis: [{
              title: {text: 'Prediction, Failure Rate'},
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
          }],
          tooltip: {
              shared: true
          },
          series: [{
              name: 'Prediction',
              data: [],
          },
          {
              name: 'Failure Rate',
              data: [],
          }
          ]
      };

    $.getJSON('/api/weibulltable?classType='+classType+'&partNumber='+partNumber+'&vintage='+vintage+'&format=highcharts', function(jsonData) {
        options.title.text = jsonData.data.classType + ' Chart';
        options.subtitle.text = 'IBMPN:'+jsonData.data.partNumber+' Vintage:'+jsonData.data.vintage+' Prediction vs Actual';
        options.xAxis[0].categories = jsonData.data.categories
        options.series[0].data = jsonData.data['prediction'];
        options.series[1].data = jsonData.data['failureRate'];
        var chart = new Highcharts.Chart(options);
    });
  }


}).call(this)