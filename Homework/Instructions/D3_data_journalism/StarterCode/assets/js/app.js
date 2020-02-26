// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeigt = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .enter()
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.enter()
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "healthcareLow";
var chosenYAxis = "income";
function xScale(trendData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(trendData, d => d[chosenXAxis]),
            d3.max(trendData, d =>d[chosenXAxis])
        ])
        .range([0, width]);
    return xLinearScale;
}
function yScale(trendData, chosenYaxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([heighth, 0]);    
    .range([d3.min(trendData, d => d[chosenYAxis]),
            d3.max(trendData, d => d[chosenYAxis])
        ])
    return yLinearScale;
}
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d=>newXScale(d[chosenXAxis]));
    return circlesGroup;
}

function updateToolTip(chosenXAxis, circlesGroup) {
    if (chosenXAxis === "healthcareLow") {
        var label = "Low Healthcare";
    }
    else if (chosenXAxis === "obesityHigh") {
        var label = "High Obesity";
    }
    else {
        var label = "High Smoking"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`${d.income}<br>${label} ${d[chosenXaxis]}`);
        });
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    return circlesGroup;
}

d3.csv("data.csv").then(function(trendData) {
    trendData.forEach(function(data) {
        data.healthcareLow = +data.healthcareLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokesHigh = +data.smokesHigh;
        data.income = +data.income;
        data.state = +data.state;
        data.poverty = +data.poverty;
    });
    var xLinearScale = xScale(trendData, chosenXaxis);
    var yLinearScale = yScale(trendData, chosenYaxis);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform",`translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(${height}, 0)`)
        .call(leftAxis);
    chartGroup.append("g")
        .call(leftAxis);
    var circlesGroup = chartGroup.selectAll("circle")
        .data(trendData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", [chosenYAxis])
        .attr("fill", "blue")
        .attr("opacity", ".5");
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width /3}, ${height + [yAxis]})`);
    var healthcareLowLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcareLow")
        .classed("active", true)
        .text("Low Healthcare");
    var obesityHighLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesityHigh")
        .classed("active", true)
        .text("High Obesity");
    var smokesHighLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "smokesHigh")
        .classed("active", true)
        .text("High Smoking"); 
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90")
        .attr("transform", `translate(${width /3}, ${heigth + [xAxis]})`)
    var incomeLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 -(height / 3))
        .attr("dy", "20")
        .classed("axis-text", true)
        .text("Income");
    var stateLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 -(height / 3))
        .attr("dy", "20")
        .classed("axis-text", true)
        .text("State");
    var povertyLabel = ylabelsGroup.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 -(height / 3))
        .attr("dy", "20")
        .classed("axis-text", true)
        .text("Poverty");
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            var xvalue = d3.select(this).attr("xvalue");
            if (xvalue !==chosenXAxis) {
                chosenXAxis = xvalue;
                xLinearScale = xScale(data, chosenXAxis);
                xAxis = renderAxes(xLinearScale, xAxis);
                circlesGroup = renderCircles(chosenYAxis, xLinearScale, chosenXAxis);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);
                if (chosenXAxis === "healthcareLow") {
                    healthcareLowLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityHighLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesHighLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "obesityHigh") {
                    obesityHighLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLowLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesHighLabel
                        .classed("active", false)
                        .classed("inactive", true);   
                }
                else (chosenXAxis === "smokesHigh") {
                    smokesHighLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityHighLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLowLabel
                        .classed("active", false)
                        .classed("inactive", true);
                };
        }
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            var yvalue = d3.select(this).attr("yvalue");
            if (yvalue !==chosenYAxis) {
                chosenYAxis = yvalue;
                yLinearScale = yScale(data, chosenYAxis);
                yAxis = renderAxes(yLinearScale, yAxis);
                circlesGroup = renderCircles(chosenXAxis, yLinearScale, chosenYAxis);
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);
                if (chosenYAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    stateLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "state") {
                    stateLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);   
                }
                else (chosenYAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    stateLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        });
    }).catch(function(error) {
        console.log(error);
    });