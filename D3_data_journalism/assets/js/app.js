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
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
// Initial parameters
var chosenXAxis = "income";

// Function used for updating x-scale var upon click on axis label
function xScale(peopleData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(peopleData, d => d[chosenXAxis]) * offscreenBuffering.8,
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
    if (chosenXAxis === "income") {
        var label = "Income";
    }
    else {
        var label = "Age: ",
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([120, -10])
        .html(function(d) {
            return(`${d.state}<br>Coverage: ${parseFloat(d.healthcare*100).toFixed(1)%<br>${label}${d[chosenXAxis]}`);
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

// Read csv
d3.csv("assets/data/data.csv").then(function(data) {
    // Test data
    console.log(data[1]);
    // Parse data
    data.forEach(function(incomeData) {
        incomeData.income = +incomeData.income;
        incomeData.healthcare = +incomeData.healthcare/100;
        incomeData.age = +incomeData.age;
    });

    //xLinearScale function 
    var xLinearScale = xScale(data, chosenXAxis);

    var LinearScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.healthcare)])
        .range([height, 0]);

    // Create y scale function
    var yLinearScale = xScale(data, chosenXAxis);
    
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append y axis
    chartGroup.append("g")
        .call(leftAxis)
        .ticks(10)
        .tickFormat(d3.format(", .1%"));
        
    // Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
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
        
    // Update tool tip
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup_;)
})


// function makeResponsive() {
//     var svgArea = d3.select("#scatter").select("svg");

//     if(!svgArea.empty()) {
//         svgArea.remove();
//     }
// // }

//     var svgWidth = window.innerWidth;
//     var svgHeight = window.innerHeight;

//     var margin = {
//         top: 50,
//         bottom: 50,
//         right: 50,
//         left: 50
//     };

//     var height = svgHeight - margin.top - margin.bottom;
//     var width = svgWidth - margin.left - margin.right;

//     var svg = d3
//     .select("#scatter")
//     .append("svg")
//     .attr("height", svgHeight)
//     .attr("width", svgWidth);

//     var chartGroup = svg.append("g")
//         .attr("transform", 'translate(${margin.left}, ${margin.top})');

//     d3.csv("assets/data.csv").then(function(healthData) {
//         console.log(healthData);

//         healthData.forEach(function(data) {
//             data.smokes = +data.smokes;
//             data.age = +data.age;
//         });

//         var xLinearScale = d3.scaleLinear()
//             .domain(d3.extent(healthData, d => d.age))
//             .range([0, width]);

//         var yLinearScale = d3.scaleLinear()
//             .domain([8, d3.max(healthData, d=> d.smokes)])
//             .range([height, 0]);
            
//         var xAxis = d3.axisBottom(xLinearScale);
//         var yAxis = d3.axisLeft(yLinearScale);
        
//         chartGroup.append("g")
//             .attr("transform", 'translate(0, ${height})')
//             .call(xAxis);

//         chartGroup.append("g")
//             .call(yAxis);
            
//         chartGroup.append("g").selectAll("text")
//             .data(healthData)
//             .enter()
//             .append("text")
//             .text(d => d.abbr)
//             .attr("x", d => xLinearScale(d.age))
//             .attr("y", d => yLinearScale(d.smokes))
//             .attr("text-anchor", "middle")
//             .attr("alingment-baseline", "central")
//             .attr("font_family", "sans-serif")
//             .attr("font-size", "10px")
//             .attr("fill", "white")
//             .style("font-weight", "bold");
            
//             chartGroup.append("text")
//             .attr("transform", 'translate(${width / 2}, ${height + margin.top - 10})')
//             .attr("text-anchor", "middle")
//             .attr("font-size", "16px")
//             .attr("fill", "black")
//             .attr("transform", "rotate(-90)")
//             .text("Percentage Who Smoke");
//     })
// };

// makeResponsive();

// d3.select(window).on("resize", makeResponsive);
