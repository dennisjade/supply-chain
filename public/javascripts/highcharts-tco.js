
(function(){

  if ($("#tco-page").length > 0){
    var classType = $("input[name=classType]").val();
    var partNumber = $("input[name=partNumber]").val();

    var options = {
          chart: {
              renderTo: 'container-tco'
          },
          title: {
              text: 'Chart'
          },
          subtitle: {
              text: '',
          },
          xAxis: [{
              categories: [],
              labels: {rotation: -45}
          }],
          yAxis: [{ // Primary yAxis
              title: {
                  text: '5 Year ATCQ'
              },
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
              name: '5 Year ATCQ',
              data: [],
          }]
      };

    $.getJSON('/api/tcotable?classType='+classType+'&partNumber='+partNumber+'&format=highcharts', function(jsonData) {
        options.title.text = jsonData.data.classType + ' Chart';
        options.subtitle.text = jsonData.data.partNumber + ' 5 Year ATCQ Performance';
        options.xAxis[0].categories = jsonData.data.categories
        options.series[0].data = jsonData.data['5YEAR_ATCQ'];
        var chart = new Highcharts.Chart(options);
    });
  }


}).call(this)