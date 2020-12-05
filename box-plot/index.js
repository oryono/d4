/**
 * Creates a chart using D3
 * @param {object} data Object containing historical data of BPI
 */
d3.csv("data.csv").then(function(data) {
    let claims = []

    data.forEach(function(d) {
        claims.push(d.PubNumClaims);
    });

    claims = claims.slice(0, 1000)

    const svgWidth = 400, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('#plot')
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Compute summary statistics used for the box:
    const data_sorted = claims.sort(d3.ascending)
    const q1 = d3.quantile(data_sorted, .25)
    const median = d3.quantile(data_sorted, .5)
    const q3 = d3.quantile(data_sorted, .75)
    const interQuantileRange = q3 - q1
    const min = q1 - 1.5 * interQuantileRange
    const max = q1 + 1.5 * interQuantileRange

    console.log(min)
    console.log(max)
    console.log(interQuantileRange)
    console.log("q1",q1)
    console.log("q3", q3)
    console.log("med",median)

// Show the Y scale
    const y = d3.scaleLinear()
        .domain([min, max + 10])
        .range([height, 0]);
    svg.call(d3.axisLeft(y))

    const center = 200
    let boxWidth = 100

// Show the main vertical line
    svg
        .append("line")
        .attr("x1", center)
        .attr("x2", center)
        .attr("y1", y(min) )
        .attr("y2", y(max) )
        .attr("stroke", "black")

// Show the box
    svg
        .append("rect")
        .attr("x", center - boxWidth/2)
        .attr("y", y(q3) )
        .attr("height", (y(q1)-y(q3)) )
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")

// show median, min and max horizontal lines
    svg
        .selectAll("toto")
        .data([min, median, max])
        .enter()
        .append("line")
        .attr("x1", center-boxWidth/2)
        .attr("x2", center+boxWidth/2)
        .attr("y1", function(d){ return(y(d))} )
        .attr("y2", function(d){ return(y(d))} )
        .attr("stroke", "black")

});