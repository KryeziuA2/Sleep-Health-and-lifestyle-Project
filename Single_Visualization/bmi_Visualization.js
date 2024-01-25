class BMIVisualizer {
  constructor(data) {
    this.data = data;
  }

  createVisualization() {
    const bmiCategoryCounts = Object.values(this.data['BMI Category']).reduce((counts, category) => {
      counts[category] = (counts[category] || 0) + 1;
      return counts;
    }, {});

    const bmiCategoryData = Object.keys(bmiCategoryCounts).map(category => ({
      category,
      count: bmiCategoryCounts[category]
    }));

    const svg = d3.select("#bmiCategory")
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(bmiCategoryData.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(bmiCategoryData, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(bmiCategoryData)
      .join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.count))
      .attr("height", d => y(0) - y(d.count))
      .attr("width", x.bandwidth());

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Define padding values
    const paddingLeft = 20; // Adjust as needed
    const paddingTop = 5; // Adjust as needed

    // Add text with padding
    svg.append("text")
      .attr("x", width / 2 + paddingLeft)  // Adjust the left padding
      .attr("y", margin.top / 2 + paddingTop);  // Adjust the top padding

    // Add zoom-in icon
    d3.select("#bmiCategory")
      .append("div")
      .attr("class", "zoom-icon zoom-in")
      .on("click", () => {
        svg.transition().call(zoom.scaleBy, 2);
      })
      .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" style="margin-right: 10px;"><path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 0 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1z"/></svg>');

    // Add zoom-out icon
    d3.select("#bmiCategory")
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
    const bmiVisualizer = new BMIVisualizer(data.data);
    bmiVisualizer.createVisualization();
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
