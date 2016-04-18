(function(){
  d3.select(window).on("resize", throttle);

  var zoom = d3.behavior.zoom()
          .scaleExtent([1, 9])
          .on("zoom", move);

  var width = 672,
      height = 350;

  var topo, projection, path, svg, g;

  var graticule = d3.geo.graticule();

  var tooltip = d3.select("#container-map").append("div").attr("class", "tooltip hidden");

  setup(width,height);
  function setup(width,height){
      projection = d3.geo.mercator()
          .translate([(width/2), (height/2)])
          .scale( width / 3 / Math.PI);

      path = d3.geo.path().projection(projection);

      svg = d3.select("#container-map").append("svg")
              .attr("width", width)
              .attr("height", height)
              .call(zoom)
              .append("g");

      g = svg.append("g");
  }

  d3.json("/fixtures/world-topo-min.json", function(error, world) {
      var countries = topojson.feature(world, world.objects.countries).features;
      topo = countries;
      draw(topo);
  });

  function draw(topo) {
      svg.append("path")
           .datum(graticule)
           .attr("class", "graticule")
           .attr("d", path);

      g.append("path")
       .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
       .attr("class", "equator")
       .attr("d", path);

      var country = g.selectAll(".country").data(topo);

      country.enter().insert("path")
              .attr("class", "country")
              .attr("d", path);

      //offsets for tooltips
      //var offsetL = document.getElementById('container').offsetLeft +20;
      //var offsetT = document.getElementById('container').offsetTop+10;

      //tooltips
      //country
      //    .on("mousemove", function(d,i) {
      //     var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      //
      //     tooltip.classed("hidden", false)
      //                  .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
      //                  .html(d.properties.name);
      //     })
      //     .on("mouseout",    function(d,i) {
      //         tooltip.classed("hidden", true);
      //     });

      d3.csv("/fixtures/Country.csv", function(err, list) {
          list.forEach(function(i) {
              processData(i);
          });
      });
  }

  function redraw() {
      width = document.getElementById('container').offsetWidth;
      height = width / 2;
      d3.select('svg').remove();
      setup(width,height);
      draw(topo);
  }


  function move() {
      var t = d3.event.translate;
      var s = d3.event.scale; 
      zscale = s;
      var h = height/4;

      t[0] = Math.min(
          (width/height)    * (s - 1), 
          Math.max( width * (1 - s), t[0] )
      );

      t[1] = Math.min(
          h * (s - 1) + h * s, 
          Math.max(height    * (1 - s) - h * s, t[1])
      );

      zoom.translate(t);
      g.attr("transform", "translate(" + t + ")scale(" + s + ")");

      //adjust the country hover stroke width based on zoom level
      d3.selectAll(".country").style("stroke-width", 1.5 / s);

  }

  var throttleTimer;
  function throttle() {
      window.clearTimeout(throttleTimer);
          throttleTimer = window.setTimeout(function() {
              redraw();
          }, 200);
  }

  //process give return data
  function processData(data) {
      if ((data.CTRY != "UNKNOWN") && data.LAT && data.LONG) {
  var gpoint = g.append("g").attr("class", "gpoint");
  var x = projection([data.LONG, data.LAT])[0];
  var y = projection([data.LONG, data.LAT])[1];
  if (!x || !y) return;
  if (data.RETCNT < 500) {
    gpoint.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class","point")
        .attr("r", 0.04 * data.RETCNT)
        .style("opacity", .7)
        .style("fill", function() {
          if (data.RETCNT <= 10)         return '#fffbe5';
          else if (data.RETCNT <= 100)   return '#fff4b2';
          else if (data.RETCNT <= 250)   return '#ffe966';
          else if (data.RETCNT <= 500)   return '#ff6666';
          else if (data.RETCNT <= 750)   return '#ff3232';
          else if (data.RETCNT <= 1000)  return '#ff1919';
          else if (data.RETCNT <= 1250)  return '#e50000';
          else if (data.RETCNT <= 1500)  return '#cc0000';
          else return '#b20000';
        });
  }

  gpoint.on("mouseover", function(d) {
              console.log("mouseover");
    pnToolTip.html(d.RETCNT);
  });
      }
  }
}).call(this)