document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select("#grid");
    const width = 600;
    const height = 600;
    const margin = 50;

    const xScale = d3.scaleLinear().domain([-10, 10]).range([margin, width - margin]);
    const yScale = d3.scaleLinear().domain([-10, 10]).range([height - margin, margin]);

    let charges = []; // Array to store charge data

    // Initialize SVG Grid
    let pointP = {
        x: Math.random() * 20 - 10, // Random initial x
        y: Math.random() * 20 - 10  // Random initial y
    };
    
    function initializeGrid() {
        addGridLines();
        addAxes();
        addAxisLabels();
        addArrowMarker();
        renderPointP(); // Render point P after setting up the grid
        renderElectricField(); // Render the electric field vector
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
                // Add x-axis numbers
                svg.append("text")
                    .attr("x", xScale(i))
                    .attr("y", yScale(0) + 15)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "10px")
                    .attr("fill", "black")
                    .attr("class", "axis-number") // Add this class for styling
                    .text(i);
    
                // Add y-axis numbers
                svg.append("text")
                    .attr("x", xScale(0) - 15)
                    .attr("y", yScale(i) + 5)
                    .attr("text-anchor", "end")
                    .attr("font-size", "10px")
                    .attr("fill", "black")
                    .attr("class", "axis-number") // Add this class for styling
                    .text(i);
            }
        }
    
        // Add x-axis label
        svg.append("text")
            .attr("x", xScale(10) + 20)
            .attr("y", yScale(0) + 5)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .attr("class", "axis-label") // Add this class for styling
            .text("x");
    
        // Add y-axis label
        svg.append("text")
            .attr("x", xScale(0) - 10)
            .attr("y", yScale(10) - 20)
            .attr("text-anchor", "middle")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .attr("class", "axis-label") // Add this class for styling
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
            .attr("fill", "green");
    }

    function renderElectricField() {
        const electricField = calculateElectricField(); // Calculate resultant E-field
        const eMagnitude = Math.sqrt(electricField.x ** 2 + electricField.y ** 2);
    
        // Scale the electric field vector for visualization
        const scaleFactor = 100; // Adjust this to fit the vector on the grid
        const scaledEx = electricField.x * scaleFactor;
        const scaledEy = electricField.y * scaleFactor;
    
        // Bind data for the electric field vector
        const eVector = svg.selectAll(".electric-field-vector").data([electricField]);
    
        // Update the vector line
        eVector
            .attr("x1", xScale(pointP.x))
            .attr("y1", yScale(pointP.y))
            .attr("x2", xScale(pointP.x) + scaledEx)
            .attr("y2", yScale(pointP.y) - scaledEy) // Flip y-axis for SVG
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)");
    
        // Create the vector line if it doesn't exist
        eVector.enter()
            .append("line")
            .attr("class", "electric-field-vector")
            .attr("x1", xScale(pointP.x))
            .attr("y1", yScale(pointP.y))
            .attr("x2", xScale(pointP.x) + scaledEx)
            .attr("y2", yScale(pointP.y) - scaledEy)
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#arrowhead)");
    
        eVector.exit().remove();
    
        // Add or update the electric field label
        // const eVectorLabel = svg.selectAll(".electric-field-label").data([electricField]);
    
        // eVectorLabel
        //     .attr("x", xScale(pointP.x) + scaledEx / 2)
        //     .attr("y", yScale(pointP.y) - scaledEy / 2 - 10) // Offset above the vector
        //     .text(`E`);
    
        // eVectorLabel.enter()
        //     .append("text")
        //     .attr("class", "electric-field-label")
        //     .attr("text-anchor", "middle")
        //     .attr("font-size", "10px")
        //     .attr("fill", "red")
        //     .attr("x", xScale(pointP.x) + scaledEx / 2)
        //     .attr("y", yScale(pointP.y) - scaledEy / 2 - 10)
        //     .text(`E`);
    
        // eVectorLabel.exit().remove();
    }
    

    function renderPointP() {
        const pointSelection = svg.selectAll(".point-p").data([pointP]);
    
        // Update the position of point P
        pointSelection
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y));
    
        // Create point P if it doesn't exist
        pointSelection.enter()
            .append("circle")
            .attr("class", "point-p")
            .attr("r", 10)
            .attr("fill", "green")
            .style("cursor", "grab")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .call(
                d3.drag()
                    .on("start", function () {
                        d3.select(this).style("cursor", "grabbing");
                    })
                    .on("drag", function (event, d) {
                        const [x, y] = d3.pointer(event, svg.node());
                        d.x = xScale.invert(x);
                        d.y = yScale.invert(y);
    
                        renderPointP(); // Re-render the point
                        updatePositionVectors(); // Update all positions dynamically
                        updateElectricFieldSection(); // Update E-field in the sidebar
                    })
                    .on("end", function () {
                        d3.select(this).style("cursor", "grab");
                    })
            );
    
        pointSelection.exit().remove();
    
        // Draw vector from origin to P
        const vectorSelection = svg.selectAll(".vector-r").data([pointP]);
    
        vectorSelection
            .attr("x2", d => xScale(d.x))
            .attr("y2", d => yScale(d.y))
            .style("display", d3.select("#show-vectors").property("checked") ? "block" : "none");
    
        vectorSelection.enter()
            .append("line")
            .attr("class", "vector-r")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", d => xScale(d.x))
            .attr("y2", d => yScale(d.y))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrowhead)")
            .style("display", d3.select("#show-vectors").property("checked") ? "block" : "none");
    
        vectorSelection.exit().remove();

        // Add or update label for point P
        const pointLabel = svg.selectAll(".point-p-label").data([pointP]);

        pointLabel
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y) - 15) // Offset label above the point
            .text("P");

        pointLabel.enter()
            .append("text")
            .attr("class", "point-p-label")
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .attr("class", "point-p-label")
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y) - 15) // Offset label above the point
            .text("P");

        pointLabel.exit().remove();

        renderElectricField();
    }
    
    
    

    // Render charges and their vectors
    function renderCharges() {
        // Bind data to charges
        const chargeCircles = svg.selectAll(".charge").data(charges);
    
        // Update existing charges
        chargeCircles
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y));
    
        // Create new charges
        chargeCircles.enter()
            .append("circle")
            .attr("class", "charge")
            .attr("r", 10)
            .attr("fill", "#007BFF")
            .style("cursor", "grab")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .call(
                d3.drag()
                    .on("start", function () {
                        d3.select(this).style("cursor", "grabbing");
                    })
                    .on("drag", function (event, d) {
                        const [x, y] = d3.pointer(event, svg.node());
                        d.x = xScale.invert(x);
                        d.y = yScale.invert(y);
    
                        renderCharges(); // Re-render everything
                        updatePositionVectors(); // Update position vectors in the side panel
                        updateElectricFieldSection(); // Update E-field in the sidebar
                    })
                    .on("end", function () {
                        d3.select(this).style("cursor", "grab");
                    })
            );
    
        // Remove old charges
        chargeCircles.exit().remove();
    
        // Bind data to vectors
        const positionVectors = svg.selectAll(".position-vector").data(charges);
    
        // Update existing vectors
        positionVectors
            .attr("x2", d => xScale(d.x))
            .attr("y2", d => yScale(d.y));
    
        // Create new vectors
        positionVectors.enter()
            .append("line")
            .attr("class", "position-vector")
            .attr("x1", xScale(0))
            .attr("y1", yScale(0))
            .attr("x2", d => xScale(d.x))
            .attr("y2", d => yScale(d.y))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("marker-end", "url(#arrowhead)")
            .style("display", d3.select("#show-vectors").property("checked") ? "block" : "none");
    
        // Remove old vectors
        positionVectors.exit().remove();
    
        // Bind data to charge labels
        const chargeLabels = svg.selectAll(".charge-label").data(charges);
    
        // Update existing labels
        chargeLabels
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y) - 15) // Offset label above the charge
            .text((_, index) => `q${index + 1}`); // Update text if needed
    
        // Create new labels
        chargeLabels.enter()
            .append("text")
            .attr("class", "charge-label")
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "black")
            .style("pointer-events", "none") // Prevent interactions with the label
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y) - 15) // Offset label above the charge
            .text((_, index) => `q${index + 1}`);
    
        // Remove old labels
        chargeLabels.exit().remove();

        renderElectricField(); // Render the electric field vector
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
            charges.push({
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10
            });
        }
        renderCharges();
        updatePositionVectors();
        updateChargeInputs();
    }

    function updatePositionVectors() {
        const positionsContainer = d3.select("#positions");
        positionsContainer.selectAll("p").remove(); // Clear old position text
    
        // Add position text for charges
        charges.forEach((charge, index) => {
            positionsContainer.append("p")
                .attr("class", "position-vector")
                .html(`\\( \\vec{r}_${index + 1} = \\langle ${charge.x.toFixed(1)}, ${charge.y.toFixed(1)} \\rangle \\)`);
        });
    
        // Add position text for point P
        positionsContainer.append("p")
            .attr("class", "point-p-position")
            .html(`\\( P = \\langle ${pointP.x.toFixed(1)}, ${pointP.y.toFixed(1)} \\rangle \\)`);
    
        // Render LaTeX for all positions
        renderMathInElement(positionsContainer.node());
    }
    

    function updateChargeInputs() {
        const chargesContainer = d3.select("#charges");
        chargesContainer.selectAll("div").remove(); // Clear old inputs
    
        charges.forEach((charge, index) => {
            const chargeRow = chargesContainer.append("div").attr("class", "charge-row");
    
            // Label for the charge (e.g., q1)
            chargeRow.append("label")
                .text(`q${index + 1}:`)
                .style("margin-right", "10px");
    
            // Numeric input for the charge value
            chargeRow.append("input")
                .attr("type", "number")
                .attr("step", "0.01") // Allows small charge values
                .attr("value", charge.q || 1.0) // Default charge value
                .style("width", "80px")
                .on("input", function () {
                    // Update the charge value in the array
                    charge.q = parseFloat(this.value);
                    calculateElectricField(); // Recalculate E-field
                    updateElectricFieldSection(); // Update E-field in the sidebar
                });
    
            // Unit label (nanocoulombs)
            chargeRow.append("span").text("nC").style("margin-left", "5px");
        });
    }

    updateChargeInputs();

    function calculateElectricField() {
        const k = 8.99e9; // Coulomb's constant in N·m²/C²
        let eField = { x: 0, y: 0 }; // Initialize resultant field
    
        charges.forEach(charge => {
            const dx = pointP.x - charge.x; // x-component of vector from charge to P
            const dy = pointP.y - charge.y; // y-component of vector from charge to P
            const rSquared = dx * dx + dy * dy; // Distance squared
            const r = Math.sqrt(rSquared); // Distance magnitude
    
            if (r === 0) return; // Avoid division by zero if charge overlaps with P
    
            const qCoulombs = (charge.q || 1.0) * 1e-9; // Convert nC to C
            const eMagnitude = (k * Math.abs(qCoulombs)) / rSquared; // Field magnitude
    
            // Components of the electric field vector
            const eX = eMagnitude * (dx / r);
            const eY = eMagnitude * (dy / r);
    
            // Add this charge's contribution to the resultant field
            eField.x += eX * Math.sign(qCoulombs); // Account for sign of charge
            eField.y += eY * Math.sign(qCoulombs);
        });
    
        return eField; // Return resultant field vector
    }

    function updateElectricFieldSection() {
        const electricField = calculateElectricField(); // Calculate resultant field
    
        const electricFieldContainer = d3.select("#electric-field");
        electricFieldContainer.selectAll("p").remove(); // Clear old content
    
        // Add the equation
        electricFieldContainer.append("p")
            .html(`\\( \\vec{E} = k\\frac{q}{\\lvert \\vec{R} \\rvert^2}\\hat{R}, \\quad \\text{where } \\hat{R} = \\frac{\\vec{R}}{\\lvert \\vec{R} \\rvert} \\)`);
    
        // Add the electric field vector
        const eMagnitude = Math.sqrt(electricField.x ** 2 + electricField.y ** 2);
        electricFieldContainer.append("p")
            .html(`\\( \\vec{E} = \\langle ${electricField.x.toFixed(4)}, ${electricField.y.toFixed(4)} \\rangle \\text{ N/C} \\)`);
    
        // Add the magnitude in scientific notation
        electricFieldContainer.append("p")
            .html(`\\( \\lvert \\vec{E} \\rvert = ${eMagnitude.toFixed(4)} \\text{ N/C} \\)`);
    
        // Render LaTeX
        renderMathInElement(electricFieldContainer.node());
    }
    
    
    


    // Event Listeners
    d3.select("#charge-count").on("input", function () {
        const count = +d3.select(this).property("value");
        initializeCharges(count);
    });

    d3.select("#reset-btn").on("click", function () {
        // Re-randomize charges and ensure q values are set
        charges.forEach((charge, index) => {
            charge.x = Math.random() * 20 - 10;
            charge.y = Math.random() * 20 - 10;
            charge.q = charge.q || 1.0; // Ensure q is set to a default value in μC if undefined
        });
    
        // Re-randomize point P
        pointP.x = Math.random() * 20 - 10;
        pointP.y = Math.random() * 20 - 10;
    
        // Animate charges and vectors
        svg.selectAll(".charge")
            .data(charges)
            .transition()
            .duration(500)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y));
    
        svg.selectAll(".position-vector")
            .data(charges)
            .transition()
            .duration(500)
            .attr("x2", d => xScale(d.x))
            .attr("y2", d => yScale(d.y));
    
        // Animate point P
        svg.selectAll(".point-p")
            .data([pointP])
            .transition()
            .duration(500)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y));
    
        svg.selectAll(".vector-r")
            .data([pointP])
            .transition()
            .duration(500)
            .attr("x2", d => xScale(d.x))
            .attr("y2", d => yScale(d.y));
    
        svg.selectAll(".vector-r-label")
            .data([pointP])
            .transition()
            .duration(500)
            .attr("x", d => (xScale(0) + xScale(d.x)) / 2)
            .attr("y", d => (yScale(0) + yScale(d.y)) / 2 - 10);
    
        // Animate labels to their new positions
        svg.selectAll(".charge-label")
            .data(charges)
            .transition()
            .duration(500)
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y) - 15); // Offset above the charge
    
        svg.selectAll(".point-p-label")
            .data([pointP])
            .transition()
            .duration(500)
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y) - 15);

        svg.selectAll(".electric-field-vector")
            .data([calculateElectricField()])
            .transition()
            .duration(500)
            .attr("x1", xScale(pointP.x))
            .attr("y1", yScale(pointP.y))
            .attr("x2", d => xScale(pointP.x) + d.x * 100)
            .attr("y2", d => yScale(pointP.y) - d.y * 100);
    
        // Update side panel inputs and positions after animation
        setTimeout(() => {
            updateChargeInputs(); // Refresh charge input fields
            updatePositionVectors(); // Refresh positions in the sidebar
            updateElectricFieldSection(); // Recalculate and display electric field
        }, 500); // Wait for animations to complete
    });
    
    
    
    d3.select("#show-vectors").on("change", function () {
        const show = d3.select(this).property("checked");
    
        // Toggle visibility of position vectors and labels
        svg.selectAll(".position-vector").style("display", show ? "block" : "none");
        svg.selectAll(".vector-label").style("display", show ? "block" : "none");
    
        // Toggle visibility of vector r and its label
        svg.selectAll(".vector-r").style("display", show ? "block" : "none");
        svg.selectAll(".vector-r-label").style("display", show ? "block" : "none");
    });
    
    // Initialize the app
    initializeGrid();
    initializeCharges(2);
    calculateElectricField(); // Calculate E-field at the start
    updateElectricFieldSection(); // Update E-field in the sidebar 
    renderElectricField(); // Render the electric field vector
});
