
function render_country_chart(data) {

    //data = d3.entries(data);
    const svgContainer = d3.select('#world_chart');

    svgContainer.selectAll('*').remove();

    const margin = 10;
    const origiWidth = $('#world_chart').width();
    const origiHeight = $('#world_chart').height();
    const width = origiWidth - margin * 2;
    const height = origiHeight - margin * 2;

    

    var svg = svgContainer.append('svg')
                .attr("width", width)
                .attr("height", height)

  svg.append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");
    data.push({ "country" : 'Root', "value" : 0, 'Continent' : null });
    data.push({ "country" : 'Asia', "value" : 0, 'Continent' : 'Root'});
    data.push({ "country" : 'Europe', "value" : 0, 'Continent' : 'Root'});
    data.push({ "country" : 'South America', "value" : 0, 'Continent' : 'Root'});
    data.push({ "country" : 'North America', "value" : 0, 'Continent' : 'Root'});
    data.push({ "country" : 'Africa', "value" : 0, 'Continent' : 'Root'});
    data.push({ "country" : 'Oceania', "value" : 0, 'Continent' : 'Root'});

  

  
  // Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeBlues[9];
// colorScheme.unshift("#eff")
var colorScale = d3.scaleThreshold()
    .domain([1,10,25,50,80,150,300,450,800,1300,1800,2800,3800,5000])
    .range(colorScheme);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
// g.append("text")
//     .attr("class", "caption")
//     .attr("x", 0)
//     .attr("y", -6)
//     .text("countries");
// var labels = ['0', '1-5', '6-10', '11-25', '26-100', '101-1000', '> 1000'];
// var legend = d3.legendColor()
//     .shapePadding(4)
//     .scale(colorScale);
// svg.select(".legendThreshold")
//     .call(legend);
var Tooltip = d3.select("#world_chart")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 1)
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")


// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-5, 0])
//   .html(function(d) {
//     var dataRow = countryById.get(d.properties.name);
//        if (dataRow) {
//            console.log(dataRow);
//            return dataRow.country + ": " + dataRow.freq_count;
//        } else {
//            console.log("no dataRow", d);
//            return d.properties.name + ": No data.";
//        }
//   })
// Load external data and boot
d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "static/js/country_data.csv", function(d) { data.set(d.code, +d.freq_count); })
    .await(ready);

function ready(error, topo) {
    if (error) throw error;
    var mouseOver = function(d) {
      d3.selectAll(".country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
        Tooltip
        .style("opacity",1)
        
    }
    
    var mouseLeave = function(d) {
      d3.selectAll(".country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      Tooltip
      .style("opacity", 0)
    }
     var mousemove = function(d) {
      Tooltip
      .html((d.freq_count)+" responders")
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
     }
    // Draw the map
    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
            .attr("fill", function (d){
                // Pull data for this country
                d.freq_count = data.get(d.id);
                // Set the color
                return colorScale(d.freq_count/10);
            })
            .attr("d", path)
            .attr("class", function(d){return "country";} )
            .style("opacity", .8)
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .on("mousemove", mousemove );
        
} 

//  let mouseout=function()
//  {

//  }
  
  // var mouseover = function(d) {
  //   Tooltip
  //     .style("opacity", 1)
  // }

  // var mouseleave = function(d) {
  //   Tooltip
  //     .style("opacity", 0)
  // }

  // svg.selectAll("path")
  // .data(root.leaves())
  // .enter()
  // .append("path")
  //   // draw each country
  // .attr("d", path
  //   ).style("opacity", .8)
  //   // set the color of each country
  // .attr("fill", function (d) {
  //     return color(d.data.Continent);
  //   })
  // .style("stroke", "transparent")
  // .attr("class", function(d){ return d.data.country; } )
  // .on("mouseover", mouseover )
  // .on("mouseleave", mouseleave )
  // .on("mousemove", mousemove )
  
    // .on("click", function(event) {
    //              toggleFilter('country', [{"key" : event.data.country}]);
    //        });

  // use this information to add rectangles:
  // let boxes = svg
  //   .selectAll("rect")
  //   .data(root.leaves())
  //   .enter()
  //   .append("rect")
  //     .attr('x', function (d) { return d.x0; })
  //     .attr('y', function (d) { return 0; })
  //     .attr('width', function (d) { return d.x1 - d.x0; })
  //     .attr('height', function (d) { return d.y1 - d.y0; })
  //     .style("stroke", "black")
  //     .style("fill", function(d) {return color(d.data.Continent);})
  //     .attr("class", "rects")
  //     .on("mouseover", mouseover) // What to do when hovered
  //     .on("mousemove", mousemove)
  //     .on("mouseleave", mouseleave)
  //     .on("click", function(event) {
  //           toggleFilter('country', [{"key" : event.data.country}]);
  //      });

  // boxes.transition()
  //      .duration(1000)
  //      .attr("y", function(d) { return d.y0; });

  // and to add the text labels
  // svg.selectAll("text")
  //   .data(root.leaves())
  //   .enter()
  //   .append("text")
  //     .attr("class", "title-text")
  //     .attr("x", function(d){ return d.x0 + 5})    // +10 to adjust position (more right)
  //     .transition()
  //       .duration(1000)
  //     .attr("y", function(d){ return d.y0 + 20})    // +20 to adjust position (lower)
  //     .text(function(d){ if(d.data.value > 0.02) return d.data.country.slice(0,6);})

}