// @TODO: YOUR CODE HERE!
const svgWidth = 960;
const svgHeight = 600;

const margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold chart,
// and shift by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// function used for updating x-scale const upon click on axis label
function xScale(stateData, chosenXAxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.90,
        d3.max(stateData, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

  // function used for updating y-scale const upon click on axis label
function yScale(stateData, chosenYAxis) {
    // create scales
    const yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.90,
        d3.max(stateData, d => d[chosenYAxis]) * 1.1
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

  // function used for updating xAxis const upon click on axis label
function renderXAxes(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  // function used for updating yAxis const upon click on axis label
function renderYAxes(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  
// function used for updating circles group with a transition to new circles on the X axis
function renderCirclesX(circlesGroup, newXScale, chosenXaxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  // function used for updating circles text with a transition to new circles on the X axis
function renderTextX(circlesText, newXScale, chosenXaxis) {
    
    circlesText.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
    
    return circlesText;
  }
  
// function used for updating circles group with a transition to new circles on the Y axis
function renderCirclesY(circlesGroup, newYScale, chosenYaxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
// function used for updating circles text with a transition to new circles on the Y axis
function renderTextY(circlesText, newYScale, chosenYaxis) {
    
    circlesText.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis])+4);
    
    return circlesText;
  }

var stateData

(async function(){
    stateData = await d3.csv("/assets/data/data.csv");

    // parse data
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.obesity = +data.obesity;
    });

    // xLinearScale function above csv import
    let xLinearScale = xScale(stateData, chosenXAxis);

    // yLinearScale function above csv import
    let yLinearScale = yScale(stateData, chosenYAxis);

    // Create initial axis functions
    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    let xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    let yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .classed("stateCircle", true);

    // append state abbreviation
    let circlesText = chartGroup.selectAll(".stateText")
        .data(stateData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 4)
        .attr("font-size", "10px")
        .classed("stateText", true)
        .text(d => d.abbr);

    // Create group for  2 x- axis labels
    const labelsXGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .classed("aText", true);

    const inPovertyLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    const ageLabel = labelsXGroup.append("text")
        .attr("x", 0)
        .attr("y", 50)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    // Create group for  2 y- axis labels
    const labelsYGroup = chartGroup.append("g")
        .attr("transform", `translate(-40, ${height/2}) rotate(-90)`)
        .classed("aText", true)
        ;

    const healthcareLabel = labelsYGroup.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    const obesityLabel = labelsYGroup.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");

    // x axis labels event listener
    labelsXGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            // updates x scale for new data
            xLinearScale = xScale(stateData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderXAxes(xLinearScale, xAxis);

            // updates circles with new x values
            circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

            // updates circles text with new x values
            circlesText = renderTextX(circlesText, xLinearScale, chosenXAxis);

            // changes classes to change bold text
            if (chosenXAxis === "age") {
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                inPovertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                inPovertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });

    // y axis labels event listener
    labelsYGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        const value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = value;

            // updates y scale for new data
            yLinearScale = yScale(stateData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxes(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

            // updates circles text with new y values
            circlesText = renderTextY(circlesText, yLinearScale, chosenYAxis);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
    });

})();