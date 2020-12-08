// Setup svg using Bostock's margin convention

const margin = {top: 20, right: 160, bottom: 35, left: 30};

const width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


/* Data in strings like it would be if imported from a csv */

const data = [
    { year: "1994", apparel: "260", beds: "237", bridges: "36"},
    { year: "1995", apparel: "270", beds: "268", bridges: "44"},
    { year: "1996", apparel: "384", beds: "335", bridges: "41"},
    { year: "1997", apparel: "426", beds: "298", bridges: "30"},
    { year: "1998", apparel: "508", beds: "312", bridges: "39"},
    { year: "1999", apparel: "601", beds: "314", bridges: "41"},
    { year: "2000", apparel: "568", beds: "353", bridges: "32"},
    { year: "2001", apparel: "550", beds: "343", bridges: "28"},
    { year: "2002", apparel: "497", beds: "333", bridges: "53"},
    { year: "2003", apparel: "338", beds: "373", bridges: "38"},
    { year: "2004", apparel: "408", beds: "403", bridges: "49"},
    { year: "2005", apparel: "341", beds: "389", bridges: "34"},
    { year: "2006", apparel: "381", beds: "390", bridges: "46"},
    { year: "2007", apparel: "238", beds: "278", bridges: "39"},
    { year: "2008", apparel: "220", beds: "350", bridges: "32"},
    { year: "2009", apparel: "174", beds: "331", bridges: "40"},
    { year: "2010", apparel: "401", beds: "403", bridges: "38"},
    { year: "2011", apparel: "427", beds: "354", bridges: "60"},
    { year: "2012", apparel: "429", beds: "398", bridges: "54"},
    { year: "2013", apparel: "420", beds: "457", bridges: "59"},
    { year: "2014", apparel: "427", beds: "529", bridges: "64"},
];

const parse = d3.time.format("%Y").parse;


// Transpose the data into layers
const dataset = d3.layout.stack()(["apparel", "beds", "bridges", "pears"].map(function(fruit) {
    return data.map(function(d) {
        return {x: parse(d.year), y: +d[fruit]};
    });
}));


// Set x, y and colors
const x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([10, width-10], 0.02);

const y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([height, 0]);

const colors = ["b33040", "#d25c4d", "#f2b447"];


// Define and draw axes
const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat( function(d) { return d } );

const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%Y"));

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


// Create groups for each series, rects for each segment
const groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

const rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
        const xPosition = d3.mouse(this)[0] - 15;
        const yPosition = d3.mouse(this)[1] - 25;
        tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip.select("text").text(d.y);
    });


// Draw legend
const legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });

legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice().reverse()[i];});

legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function(d, i) {
        switch (i) {
            case 0: return "Bridges";
            case 1: return "Beds";
            case 2: return "Apparel";
        }
    });


// Prep the tooltip bits, initial display is hidden
const tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");