document.addEventListener("DOMContentLoaded", () => {
    const svg = d3.select("#grid");
    const width = 600;
    const height = 600;
    const margin = 50;

    console.log("SVG dimensions (width x height):", svg.attr("width"), svg.attr("height"));

    // Create scales for the Cartesian plane
    const xScale = d3.scaleLinear().domain([-10, 10]).range([margin, width - margin]);
    const yScale = d3.scaleLinear().domain([-10, 10]).range([height - margin, margin]);

    // Add faint grid lines
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

    // Add main axes lines
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

    // Add axis labels for grid points
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

    // Add axis variable labels
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

    // Draw the circle
    let circle = svg
        .append("circle")
        .attr("cx", xScale(0))
        .attr("cy", yScale(0))
        .attr("r", 10)
        .attr("fill", "#007BFF") // Blue color for the circle
        .style("cursor", "grab") // Grab cursor when hovering over the circle
        .call(
            d3.drag()
                .on("start", function (event) {
                    d3.select(this).style("cursor", "grabbing"); // Grabbing cursor while dragging
                })
                .on("drag", function (event) {
                    // Use the event's coordinates directly to set the circle's position
                    const [x, y] = d3.pointer(event, svg.node());
                    d3.select(this)
                        .attr("cx", x)
                        .attr("cy", y);

                    // Update circle location display
                    const xCoord = xScale.invert(x).toFixed(1);
                    const yCoord = yScale.invert(y).toFixed(1);
                    d3.select("#circle-location").text(`Circle Location: (${xCoord}, ${yCoord})`);
                })
                .on("end", function () {
                    d3.select(this).style("cursor", "grab"); // Back to grab cursor after dragging
                })
        );

    // Reset button functionality
    d3.select("#reset-btn").on("click", function () {
        circle
            .attr("cx", xScale(0))
            .attr("cy", yScale(0));
        d3.select("#circle-location").text("Circle Location: (0, 0)");
    });

    // Remove SVG border
    svg.style("border", "none");
});
