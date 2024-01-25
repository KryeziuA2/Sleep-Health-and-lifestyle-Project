class AgeVisualizer {
  constructor(data) {
    this.data = data;
  }

  createVisualization() {
    const ages = Object.values(this.data['Age']);
    const ageCounts = {};

    ages.forEach(age => {
      ageCounts[age] = (ageCounts[age] || 0) + 1;
    });

    const ageData = Object.keys(ageCounts).map(age => ({
      age: parseInt(age),
      count: ageCounts[age]
    }));

    ageData.sort((a, b) => a.age - b.age);

    const svg = d3.select("#age")
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(ageData, d => d.age))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(ageData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.age))
      .y(d => y(d.count));

    const graph = svg.append("g");

    graph.append("path")
      .datum(ageData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    const zoom = d3.zoom()
      .scaleExtent([0.5, 8]) // Adjust the minimum scale for zoom-out
      .on("zoom", (event) => {
        svg.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Add x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Add y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Add zoom-in icon
    d3.select("#age")
      .append("div")
      .attr("class", "zoom-icon zoom-in")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 2);
      })
      .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" style="margin-right: 10px;"><path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 0 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1z"/></svg>');

    // Add zoom-out icon
    d3.select("#age")
      .append("div")
      .attr("class", "zoom-icon zoom-out")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 0.5); // Adjust the scale factor for zoom-out
      })
      .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z"/></svg>');

  }
}

// Fetch data from FastAPI endpoint
fetch('http://localhost:8000/read_dataset')
  .then(response => response.json())
  .then(data => {
    const ageVisualizer = new AgeVisualizer(data.data);
    ageVisualizer.createVisualization();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
