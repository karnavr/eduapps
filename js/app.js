// Modularized Code for Better Organization

document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select("#grid");
    const width = 600;
    const height = 600;
    const margin = 50;

    const xScale = d3.scaleLinear().domain([-10, 10]).range([margin, width - margin]);
    const yScale = d3.scaleLinear().domain([-10, 10]).range([height - margin, margin]);

    let charges = []; // Array to store charge data

    // Initialize SVG Grid
    function initializeGrid() {
        addGridLines();
        addAxes();
        addAxisLabels();
        addArrowMarker();
    }

    function addGridLines() {
        for (let i = -10; i <= 10; i++) {
            svg.append("line")
                .attr("x1", xScale(i))
                .attr("x2", xScale(i))
                .attr("y1", margin)
                .attr("y2", height - margin)
                .attr("stroke", "#ddd")
                .attr("stroke-width", 1);

            svg.append("line")
                .attr("x1", margin)
                .attr("x2", width - margin)
                .attr("y1", yScale(i))
                .attr("y2", yScale(i))
                .attr("stroke", "#ddd")
                .attr("stroke-width", 1);
        }
    }

    function addAxes() {
        svg.append("line")
            .attr("x1", xScale(-10))
            .attr("x2", xScale(10))
            .attr("y1", yScale(0))
            .attr("y2", yScale(0))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        svg.append("line")
            .attr("x1", xScale(0))
            .attr("x2", xScale(0))
            .attr("y1", yScale(-10))
            .attr("y2", yScale(10))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }

    function addAxisLabels() {
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                svg.append("text")
                    .attr("x", xScale(i))
                    .attr("y", yScale(0) + 15)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "10px")
                    .attr("fill", "black")
                    .text(i);

                svg.append("text")
                    .attr("x", xScale(0) - 15)
                    .attr("y", yScale(i) + 5)
                    .attr("text-anchor", "end")
                    .attr("font-size", "10px")
                    .attr("fill", "black")
                    .text(i);
            }
        }

        svg.append("text")
            .attr("x", xScale(10) + 20)
            .attr("y", yScale(0) + 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text("x");

        svg.append("text")
            .attr("x", xScale(0) - 10)
            .attr("y", yScale(10) - 20)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .text("y");
    }

    function addArrowMarker() {
        svg.append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 5)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 Z")
            .attr("fill", "black");
    }

    // Render charges and their vectors
    function renderCharges() {
        svg.selectAll(".position-vector").remove(); // Clear old vectors
        svg.selectAll(".vector-label").remove(); // Clear old vector labels
        svg.selectAll(".charge").remove(); // Clear old charges
        svg.selectAll(".charge-label").remove(); // Clear old charge labels

        charges.forEach((charge, index) => {
            drawVector(charge, index);
            drawCharge(charge, index);
        });
    }

    function drawCharge(charge, index) {
        // Draw the circle for the charge
        svg.append("circle")
            .attr("class", "charge")
            .attr("cx", xScale(charge.x))
            .attr("cy", yScale(charge.y))
            .attr("r", 10)
            .attr("fill", "#007BFF")
            .style("cursor", "grab")
            .call(
                d3.drag()
                    .on("start", function (event) {
                        d3.select(this).style("cursor", "grabbing");
                    })
                    .on("drag", function (event) {
                        const [x, y] = d3.pointer(event, svg.node());
                        d3.select(this)
                            .attr("cx", x)
                            .attr("cy", y);

                        // Update the charge's data
                        charges[index].x = xScale.invert(x);
                        charges[index].y = yScale.invert(y);

                        // Re-render everything to update vectors and labels
                        renderCharges();
                    })
                    .on("end", function () {
                        d3.select(this).style("cursor", "grab");
                    })
            );

        // Draw the label for the charge
        svg.append("text")
            .attr("class", "charge-label")
            .attr("x", xScale(charge.x))
            .attr("y", yScale(charge.y) + 4) // Slight vertical adjustment
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .style("pointer-events", "none") // Prevent interactions with the label
            .text(`q${index + 1}`);
    }

    function drawVector(charge, index) {
        // Draw the vector (line) from the origin to the charge
        svg.append("line")
            .attr("class", "position-vector")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", xScale(charge.x))
            .attr("y2", yScale(charge.y))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrowhead)")
            .style("display", d3.select("#show-vectors").property("checked") ? "block" : "none");

        // Draw the label for the vector
        svg.append("text")
            .attr("class", "vector-label")
            .attr("x", (xScale(charge.x) + xScale(0)) / 2) // Midpoint for label
            .attr("y", (yScale(charge.y) + yScale(0)) / 2 - 10) // Slight offset above the vector
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .style("display", d3.select("#show-vectors").property("checked") ? "block" : "none")
            .text(`r${index + 1}'`);
    }

    function initializeCharges(count) {
        charges = [];
        for (let i = 0; i < count; i++) {
            charges.push({ x: (i + 1) * 2, y: (i + 1) * 2 }); // Default positions
        }
        renderCharges();
        updatePositionVectors();
    }

    function updatePositionVectors() {
        const controls = d3.select("#controls");
        controls.selectAll(".position-vector").remove();

        charges.forEach((charge, index) => {
            controls.append("p")
                .attr("class", "position-vector")
                .text(`\( \vec{r}_${index + 1} = <${charge.x.toFixed(1)}, ${charge.y.toFixed(1)}> \)`);
            renderMathInElement(controls.node());
        });
    }

    // Event Listeners
    d3.select("#charge-count").on("input", function () {
        const count = +d3.select(this).property("value");
        initializeCharges(count);
    });

    d3.select("#reset-btn").on("click", function () {
        initializeCharges(charges.length); // Reset charges
    });

    d3.select("#show-vectors").on("change", function () {
        const show = d3.select(this).property("checked");

        // Toggle visibility of position vectors and labels
        svg.selectAll(".position-vector")
            .style("display", show ? "block" : "none");

        svg.selectAll(".vector-label")
            .style("display", show ? "block" : "none");
    });

    // Initialize the app
    initializeGrid();
    initializeCharges(2);
});