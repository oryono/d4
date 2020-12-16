/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
d3.csv("data.csv").then(function(data) {
    const svgWidth = 600, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear().range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(function(d) { return x(d.year)})
        .y(function(d) { return y(d.amount)})

    x.domain(d3.extent(data, function(d) { return d.year }));
    y.domain(d3.extent(data, function(d) { return d.amount }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();


    g.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .attr("stroke", "black")
        .text("Year");

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Quantity");

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        .text("Year");

});

