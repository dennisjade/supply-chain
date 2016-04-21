(function(){
        d3.select(window).on("resize", throttle);

        var zoom = d3.behavior.zoom()
                .scaleExtent([1, 9])
                .on("zoom", move);

        var width = window.innerWidth * 0.90,
            height = window.innerHeight * 0.70;

        var topo, projection, path, svg, g, country;

        var graticule = d3.geo.graticule();

        var tooltip = d3.select("#container-map").append("div").attr("class", "tooltip-map hidden");

        setup(width,height);
        function setup(width,height){
            projection = d3.geo.mercator()
                .translate([(width/2), (height/2)])
                .scale( width / 2.5 / Math.PI);

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
      d3.csv("/fixtures/Country.csv", function(err, list) {
        list.forEach(function(i) {
          processData(i);
        });
        draw(topo);
      });
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

            country = g.selectAll(".country").select("#Antarctica").remove().data(topo);
            country.enter().insert("path")
                    .attr("class", "country")
                    .attr("d", path)
          .attr("title", function(d) { return d.properties.name; })
          .style("fill", function(d) {
            if (d.properties.hasOwnProperty('retcolor'))
              return d.properties.retcolor;
          })
          .style("opacity", function(d, i) {
            if (d.properties.hasOwnProperty('retcolor')) return 0.8;
          });


            //offsets for tooltips
            var offsetL = document.getElementById('container-map').offsetLeft +20;
            var offsetT = document.getElementById('container-map').offsetTop + 10;

            //tooltips
            country
                .on("mousemove", function(d, i) {
          if (d.properties.hasOwnProperty('ret')) {
              var dispTxt = d.properties.name + ' : ' + d.properties.ret;
            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
            tooltip.classed("hidden", false)
              .attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px;color:#000000")
              .html(dispTxt);
          }
        })
        .on("mouseout", function(d,i) {
          tooltip.classed("hidden", true);
        });

      var color_domain = [5, 10, 100, 250, 500, 750, 1000, 1250, 1500, 2500, 3000, 5000, 5001];
      var ext_color_domain = [0, 5, 10, 100, 250, 500, 750, 1000, 1250, 1500, 2500, 3000, 5000];
      var legend_labels = ["< 5", "< 10", "< 100", "< 250", "< 500", "< 750", "< 1000", "< 1250", "< 1500", "< 2500", "< 3000", "< 5000", "> 5000" ];
      var color = d3.scale.threshold()
        .domain(color_domain)
        .range(["#ffffdb", "#ffffd6", "#ffffcc", "#fff0b3", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#e37e36", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]);
      var legend = svg.selectAll("g.legend")
        .data(ext_color_domain)
        .enter().append("g")
        .attr("class", "legend");

      var ls_w = 20, ls_h = 20;
      legend.append("rect")
        .attr("x", 15)
        .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d, i) {
          return color(d);
        })
        .style("opacity", 0.8);

      legend.append("text")
        .attr("x", 40)
        .attr("y", function(d, i){
          return height - (i*ls_h) - ls_h - 4;
        })
        .style("font-size", "12px")
        .text(function(d, i){
          return legend_labels[i];
        });
        }

        function redraw() {
            width = document.getElementById('container-map').offsetWidth;
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

        //classify return color
        function getRetColor(ret) {
      if (ret <= 5)          return '#ffffdb';
      if (ret <= 10)         return '#ffffd6';
      else if (ret <= 100)   return '#ffffcc';
      else if (ret <= 250)   return '#fff0b3';
      else if (ret <= 500)   return '#ffeda0';
      else if (ret <= 750)   return '#fed976';
      else if (ret <= 1000)  return '#feb24c';
      else if (ret <= 1250)  return '#fd8d3c';
      else if (ret <= 1500)  return '#e37e36';
      else if (ret <= 2500)  return '#fc4e2a';
      else if (ret <= 3000)  return '#e31a1c';
      else if (ret <= 5000)  return '#bd0026';
      else return '#800026';
    }

        //process give return data
        function processData(data) {
      var i, len = topo.length;
      for (i = 0; i < len; i++) {
        if (topo[i].properties.name.toUpperCase() == data.CTRY.toUpperCase()) {
          topo[i].properties.ret = data.RETCNT;
          topo[i].properties.retcolor = getRetColor(data.RETCNT)
        }
      }
    }
}).call(this)