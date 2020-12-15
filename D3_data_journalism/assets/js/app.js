// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart
// shift the latter by left and top margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");
// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
// Initial parameters
var chosenXAxis = "income";

// Function used for updating x-scale var upon click on axis label
function xScale(peopleData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(peopleData, d => d[chosenXAxis]) * 0.8,
        d3.max(peopleData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}


// Function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;    
}

// Function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transtion()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesGroup;    
}

// Function used for updating circles group with new tooltop
function updateToolTip(chosenXAxis, circlesGroup) {
    var label;

    if (chosenXAxis === "income") {
        label = "Income:";
    }
    else if (chosenXAxis === "age") {
        label = "Age:";
    }
    else {
        label = "Poverty:";
    };

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([120, -10])
        .html(function(d) {
            return(`${d.state}<br>${label} ${d[chosenXAxis]}`);
        });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data);
        })

        // on mouseout event
        .on("mouseout", function(dataTip, index) {
            toolTip.hide(dataTip);
        });

        return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
    var currentX = "poverty";
    var currentY = "obesity";
    if (err) throw err;
    // Test data
    console.log(data[1]);
    // Parse data
    // data.forEach(function(incomeData) {
    //     incomeData.income = +incomeData.income;
    //     incomeData.healthcare = +incomeData.healthcare/100;
    //     incomeData.age = +incomeData.age;
    // });
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    function xMinMax() {
        xMin = d3.min(data, function(d){
            return (d[currentX]);
        });
        xMax = d3.max(data, function(d) {
            return ([currentX]);
        });
    }    
    function yMinMax() {
        yMin = d3.min(data, function(d){
            return (d[currentY]);
        });
        yMax = d3.max(data, function(d) {
            return ([currentY]);
        });
    } 
    
    function labelChange(Axis, clickText) {
        d3
        .selectAll(".aText")
        .filter("."+Axis)
        .filter(".active")
        .classed("active", false)
        .classed("inactive", true);
        clickText.classed("inactive", false).classed("active", true);
    }

    xMinMax();
    yMinMax();


    //xLinearScale function 
    var xLinearScale = d3
        .scaleLinear()
        .domain([xMin,xMax])
        .range([margin.top + 100, width - margin]);

    // var LinearScale = d3.scaleLinear()
    //     .domain([0, d3.max(data, d => d.healthcare)])
    //     .range([height, 0]);

    // Create y scale function
    var yLinearScale = d3
        .scaleLinear()
        .domain([yMin,yMax])
        .range([height - margin.top - 100, margin.top]);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    // var xAxis = chartGroup.append("g")
    //     .classed("x-axis", true)
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(bottomAxis);
    svg.append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - margin - 100) +")");

    // Append y axis
    // chartGroup.append("g")
    //     .call(leftAxis)
    //     .ticks(10)
    //     .tickFormat(d3.format(", .1%"));
   svg.append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin + 100)+",0)");
    
    // Append initial circles
    // var circlesGroup = chartGroup.selectAll("circle")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => xLinearScale(d[currentX]))
    //     .attr("cy", d => yLinearScale(d[currentY]))
    //     .attr("r", 10)
    //     .attr("fill", "blue")
    //     .attr("opacity", ".5")
    var theCircles = svg.selectAll("g theCircles").data(data).enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[currentX]))
        .attr("cy", d => yLinearScale(d[currentY]))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".5")
        
    // Create group for 2 x axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
    var incomeLengthLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income")
        .classed("active", true)
        .text("Average Income Per US State");
        
    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .classed("inactive", true)
        .text("Average Age Per US State")
        
    // Append y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("active", true)
        .classed("axis-text", true)
        .text("Health Insurance Coverage (precent)");
        
    // Update tool tip function 
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup)

    // X axis labels event listener
    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var values = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;
                // updates x scale for new data
                xLinearScale = xScale(data, chosenXAxis);
                // updates x axis with transition
                xAxis = renderAxes(xLinearScale, xAxis);
                // updates circles with new x values 
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                // changes classes to change bold text
                if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLengthLabel
                        .classed("active", false)
                        .classed("inactive", true);    
                }
                else {
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true)
                    incomeLengthLabel
                        .classed("active", true)
                        .classed("inactive", false);    
                }
            }
        });
});

