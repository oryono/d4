

d3.csv("data.csv").then(function(data) {
  const svgWidth = 800, svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 100 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const svg = d3.select('svg')
      .attr("width", svgWidth)
      .attr("height", svgHeight);

  var xScale = d3.scaleBand().range([0, width]),
      yScale = d3.scaleLinear().range([height, 0]);

  const g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale.domain(data.map(function(d) { return d.year; }));
  yScale.domain([0, d3.max(data, function(d) { return d.amount; })]);

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))

  g.append("text")
      .attr("transform",
          "translate(" + (width/2) + " ," +
          (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .attr("stroke", "black")
      .text("Year");

  g.append("g")
      .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
      })
          .ticks(10))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-5.1em")
      .attr("text-anchor", "end")
      .attr("stroke", "black")
      .text("Quantity");

  g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("fill", "steelblue")
      .attr("x", function(d) { return xScale(d.year); })
      .attr("y", function(d) { return yScale(d.amount); })
      .attr("height", function(d) { return height - yScale(d.amount); })
      .attr("width", function(d) { return width / data.length - 2 })

});
