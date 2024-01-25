class StressSleepRelationshipVisualizer {
  constructor(data) {
    this.data = data;
  }

  createVisualization() {
    const stressLevels = Object.values(this.data['Stress Level']);
    const sleepDurations = Object.values(this.data['Sleep Duration']);

    const svg = d3.select("#stressSleepRelationship")
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, d3.max(stressLevels)]).nice()
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sleepDurations)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 35)
      .attr("fill", "#000")
      .text("Stress Level");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -35)
      .attr("x", -height / 2)
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("Sleep Duration");

    svg.selectAll("circle")
      .data(stressLevels.map((stress, index) => ({ stress, sleepDuration: sleepDurations[index] })))
      .enter().append("circle")
      .attr("cx", d => x(d.stress))
      .attr("cy", d => y(d.sleepDuration))
      .attr("r", 5)
      .attr("fill", "steelblue");

      // Define padding values
      const paddingLeft = 35; // Adjust as needed
      const paddingTop = 5; // Adjust as needed
      
      // Add text with padding
      svg.append("text")
          .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
          .attr("y", margin.top / 2 + paddingTop)  // Adjust the top padding
    // Add zoom-in icon
    d3.select("#stressSleepRelationship")
      .append("div")
      .attr("class", "zoom-icon zoom-in")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 2);
      })
      .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" style="margin-right: 10px;"><path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 0 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1z"/></svg>');

    // Add zoom-out icon
    d3.select("#stressSleepRelationship")
      .append("div")
      .attr("class", "zoom-icon zoom-out")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 0.5); // Adjust the scale factor for zoom-out
      })
      .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z"/></svg>');

    const zoom = d3.zoom()
      .scaleExtent([0.5, 8]) // Adjust the minimum scale for zoom-out
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });

    svg.call(zoom);
  }
}

// Fetch data from FastAPI endpoint
fetch('http://localhost:8000/read_dataset')
  .then(response => response.json())
  .then(data => {
    const stressSleepVisualizer = new StressSleepRelationshipVisualizer(data.data);
    stressSleepVisualizer.createVisualization();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
