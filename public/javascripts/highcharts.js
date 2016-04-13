
(function(){

  if ($("#ppm-toc-weibull").length > 0){
    var classType = $("input[name=classType]").val();
    var partNumber = $("input[name=partNumber]").val();

    var options = {
          chart: {
              zoomType: 'xy',
              renderTo: 'container'
          },
          title: {
              text: 'Chart'
          },
          subtitle: {
              text: '',
          },
          xAxis: [{
              categories: [],
              crosshair: true,
              labels: {rotation: -45}
          }],
          yAxis: [{ // Primary yAxis
              gridLineWidth: 0,
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[2]
                  }
              },
              title: {
                  text: 'PPM',
                  style: {
                      color: Highcharts.getOptions().colors[2]
                  }
              },
              opposite: true,
              visible: false

          }, { // Secondary yAxis
              gridLineWidth: 0,
              title: {
                  text: 'Cumm. Shipped Qty (K\'s)',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              }

          }, { // Tertiary yAxis
              gridLineWidth: 0,
              title: {
                  text: 'PPM,AVG_PPM',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              opposite: true
          }],
          tooltip: {
              shared: true
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              x: 80,
              verticalAlign: 'top',
              y: 55,
              floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          series: [{
              name: 'Cumm. Shipped Qty.',
              type: 'column',
              yAxis: 1,
              data: [],
              tooltip: {
                  valueSuffix: ''
              }

          }, {
              name: 'PPM',
              type: 'spline',
              yAxis: 2,
              data: [],
              marker: {
                  enabled: false
              },
              dashStyle: 'shortdot',
              tooltip: {
                  valueSuffix: ''
              }

          }, {
              name: 'Ave PPM',
              type: 'spline',
              yAxis: 2,
              data: [],
              tooltip: {
                  valueSuffix: ''
              }
          }]
      };

    $.getJSON('/api/ppmtable?classType='+classType+'&partNumber='+partNumber+'&format=highcharts', function(jsonData) {
        options.title.text = jsonData.data.classType + ' Chart';
        options.subtitle.text = jsonData.data.partNumber;
        options.xAxis[0].categories = jsonData.data.categories
        options.series[0].data = jsonData.data.cummShippedQty;
        options.series[1].data = jsonData.data.ppm;
        options.series[2].data = jsonData.data.avgPPM;
        var chart = new Highcharts.Chart(options);
    });
  }
/*
    $.getJSON('/api/ppmtable?classType='+classType+'&partNumber='+partNumber+'&format=highcharts&callback=?', function (jsonData) {
      $('#container').highcharts({
          chart: {
              zoomType: 'xy'
          },
          title: {
              text: jsonData.data.classType + ' Chart'
          },
          subtitle: {
              text: jsonData.data.partNumber,
          },
          xAxis: [{
              categories: jsonData.data.categories,
              crosshair: true,
              labels: {rotation: -45}
          }],
          yAxis: [{ // Primary yAxis
              labels: {
                  format: '{value}°C',
                  style: {
                      color: Highcharts.getOptions().colors[2]
                  }
              },
              title: {
                  text: 'Cumm. Shipped Qty (K\'s)',
                  style: {
                      color: Highcharts.getOptions().colors[2]
                  }
              },
              opposite: true

          }, { // Secondary yAxis
              gridLineWidth: 0,
              title: {
                  text: 'PPM, AVG_PPM',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              }

          }, { // Tertiary yAxis
              gridLineWidth: 0,
              title: {
                  text: '',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              labels: {
                  format: '{value}',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              opposite: true,
              visible : false
          }],
          tooltip: {
              shared: true
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              x: 80,
              verticalAlign: 'top',
              y: 55,
              floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          series: [{
              name: 'Cumm. Shipped Qty.',
              type: 'column',
              yAxis: 1,
              data: jsonData.data.cummShippedQty,
              tooltip: {
                  valueSuffix: ' mm'
              }

          }, {
              name: 'PPM',
              type: 'spline',
              yAxis: 2,
              data: jsonData.data.ppm,
              marker: {
                  enabled: false
              },
              dashStyle: 'shortdot',
              tooltip: {
                  valueSuffix: ' mb'
              }

          }, {
              name: 'Ave PPM',
              type: 'spline',
              data: jsonData.data.avgPPM,
              tooltip: {
                  valueSuffix: ' °C'
              }
          }]
      });
    })
  }

*/

}).call(this)