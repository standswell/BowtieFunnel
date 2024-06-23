// 1. Configuration and Constants
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const barWidth = 60;
const barSpacing = 100;
const middlePoint = height / 2;
const xStart = 100;
const priorOffset = 40;
const forecastOffset = 20;
let data;

var imageWidth = 100; // Adjust the value as needed

// 2. Element Selections
const actualCheckbox = d3.select("#actualCheckbox");
const budgetCheckbox = d3.select("#budgetCheckbox");
const priorCheckbox = d3.select("#priorCheckbox");
const forecastCheckbox = d3.select("#forecastCheckbox");
const futureBudgetCheckbox = d3.select("#futureBudgetCheckbox");

// Create the dropdown for month selection
const monthDropdown = d3.select("#monthDropdown")
    .on("change", function() {
        updateVisualization(this.value);
    });

// 3. Tooltip and Modal Setup
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 4. Event Listeners
actualCheckbox.on("change", function() {
    updateVisualization(d3.select("#monthDropdown").node().value);
});

budgetCheckbox.on("change", function() {
    updateVisualization(d3.select("#monthDropdown").node().value);
});

priorCheckbox.on("change", function() {
    updateVisualization(d3.select("#monthDropdown").node().value);
});

forecastCheckbox.on("change", function() {
    updateVisualization(d3.select("#monthDropdown").node().value);
});

futureBudgetCheckbox.on("change", function() {
    updateVisualization(d3.select("#monthDropdown").node().value);
});

// 5. Helper Functions
function showDetailData(d) {
    const detailData = d3.select("#detailData");
    detailData.html(`
        <p>Month: ${months[d.month]}</p>
        <p>Label: ${d.label}</p>
        <p>Actual: ${d.actual}</p>
        <p>Budget: ${d.budget}</p>
        <p>Prior: ${d.prior}</p>
        <p>Forecast: ${d.forecast}</p>
        <p>Future Budget: ${d.futureBudget}</p>
    `);
    modal.style.display = "block";
}

function getGradientColor(startColor, endColor, percent) {
    const start = d3.color(startColor);
    const end = d3.color(endColor);
    const r = Math.round(start.r + percent * (end.r - start.r));
    const g = Math.round(start.g + percent * (end.g - start.g));
    const b = Math.round(start.b + percent * (end.b - start.b));
    return `rgba(${r},${g},${b},0.5)`;
}

// 6. Visualization Update Function
function updateVisualization(monthIndex) {
    svg.selectAll("*").remove();

    const monthData = data.filter(d => d.month === +monthIndex);

    monthData.forEach((d, i) => {
        const yOffsetActual = middlePoint - (d.actual / 2);
        const yOffsetBudget = middlePoint - (d.budget / 2);
        const yOffsetPrior = middlePoint - (d.prior / 2);
        const yOffsetForecast = middlePoint - (d.forecast / 2);
        const yOffsetFutureBudget = middlePoint - (d.futureBudget / 2);

        const baseColor = d.label === 'Purchase' || d.label === 'Loyalty' || d.label === 'Champion' ? '#FF8C00' : (d.label === 'Churn' ? '#FF6666' : '#0000CD');
        const endColor = d.label === 'Purchase' || d.label === 'Loyalty' || d.label === 'Champion' ? '#FFA07A' : (d.label === 'Churn' ? '#FF9999' : '#6666CC');
        const actualColor = getGradientColor(baseColor, endColor, 0.5);

        if (priorCheckbox.property("checked")) {
            svg.append("rect")
                .attr("class", "prior-bar")
                .attr("x", xStart + i * (barWidth + barSpacing) - priorOffset)
                .attr("y", yOffsetPrior)
                .attr("width", barWidth)
                .attr("height", d.prior)
                .on("click", function() { showDetailData(d); });
        }

        if (actualCheckbox.property("checked")) {
            svg.append("rect")
                .attr("class", "actual-bar")
                .attr("x", xStart + i * (barWidth + barSpacing))
                .attr("y", yOffsetActual)
                .attr("width", barWidth)
                .attr("height", d.actual)
                .attr("fill", actualColor)
                .on("mouseover", function(event) {
                    tooltip.transition()
                       
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Value: ${d.actual.toFixed(2)}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function() { showDetailData(d); });
    }

    if (budgetCheckbox.property("checked")) {
        svg.append("rect")
            .attr("class", "budget-bar")
            .attr("x", xStart + i * (barWidth + barSpacing))
            .attr("y", yOffsetBudget)
            .attr("width", barWidth)
            .attr("height", d.budget)
            .attr("stroke", d.label === 'Consideration' ? 'red' : 'green')
            .on("click", function() { showDetailData(d); });
    }

    if (forecastCheckbox.property("checked")) {
        svg.append("rect")
            .attr("class", "forecast-bar")
            .attr("x", xStart + i * (barWidth + barSpacing) + barWidth - forecastOffset)
            .attr("y", yOffsetForecast)
            .attr("width", barWidth)
            .attr("height", d.forecast)
            .on("click", function() { showDetailData(d); });
    }

    if (futureBudgetCheckbox.property("checked")) {
        // Determine the color for the Future Budget
        const futureBudgetColor = (d.label === 'Awareness' || d.label === 'Familiarity') ? 'green' : 'red';

        // Add the future budget bar with the appropriate color dots
        svg.append("rect")
            .attr("class", "future-budget-bar")
            .attr("x", xStart + i * (barWidth + barSpacing) + barWidth - forecastOffset)
            .attr("y", yOffsetFutureBudget)
            .attr("width", barWidth)
            .attr("height", d.futureBudget)
            .attr("fill", "none")
            .attr("stroke", futureBudgetColor)
            .attr("stroke-dasharray", "4,4") // Adjusted for bigger dotted effect
            .attr("stroke-width", 4)
            .on("click", function() { showDetailData(d); });
    }

    svg.append("text")
        .attr("class", "label")
        .attr("x", xStart + i * (barWidth + barSpacing) + barWidth / 2)
        .attr("y", height - 20)
        .text(d.label);
});
}

// 7. Data Loading and Initialization
// Load data from CSV and initialize visualization
d3.csv("../data/data.csv").then(function(loadedData) {
loadedData.forEach(function(d) {
    d.month = +d.month;
    d.actual = +d.actual;
    d.budget = +d.budget;
    d.prior = +d.prior;
    d.forecast = +d.forecast;
    d.futureBudget = +d.futureBudget; // Add this line
});

data = loadedData;

updateVisualization(0); // Initialize with the first month

}).catch(function(error) {
console.log(error);
});
