class HeartRateStepsRelationshipVisualizer {
    constructor(data) {
      this.data = data;
    }
  
    createVisualization() {
      try {
        const heartRates = Object.values(this.data['Heart Rate']);
        const dailySteps = Object.values(this.data['Daily Steps']);
  
        const svg = d3.select("#heartDailyStepsRelationship")
          .append("svg")
          .attr("width", 400)
          .attr("height", 300);
  
        const margin = { top: 30, right: 30, bottom: 50, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;
  
        const x = d3.scaleLinear()
          .domain([0, d3.max(heartRates)]).nice()
          .range([margin.left, width - margin.right]);
  
        const y = d3.scaleLinear()
          .domain([0, d3.max(dailySteps)]).nice()
          .range([height - margin.bottom, margin.top]);
  
        svg.append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(x))
          .append("text")
          .attr("x", width / 2)
          .attr("y", margin.bottom - 5) // Adjusted position
          .attr("fill", "#000")
          .text("Heart Rate");
  
        svg.append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 10) // Adjusted position
          .attr("x", -height / 2)
          .attr("fill", "#000")
          .attr("text-anchor", "middle")
          .text("Daily Steps");
  
        svg.selectAll("circle")
          .data(heartRates.map((heartRate, index) => ({ heartRate, dailyStepsValue: dailySteps[index] })))
          .enter().append("circle")
          .attr("cx", d => x(d.heartRate))
          .attr("cy", d => y(d.dailyStepsValue))
          .attr("r", 5)
          .attr("fill", "steelblue");
  
        // Add labels, title, etc. if needed
  
        console.log('Data fetched:', this.data);
        console.log('Heart Rates:', heartRates);
        console.log('Daily Steps:', dailySteps);
        console.log('Visualization created.');
           // Add zoom-in icon
           d3.select("#heartDailyStepsRelationship")
           .append("div")
           .attr("class", "zoom-icon zoom-in")
           .on("click", () => {
               svg.transition().call(zoom.scaleBy, 2);
           })
           .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16" style="margin-right: 10px;"><path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 0 1-2 0V9H1a1 1 0 1 1 0-2h6V1a1 1 0 0 1 1-1z"/></svg>');

       // Add zoom-out icon
       d3.select("#heartDailyStepsRelationship")
           .append("div")
           .attr("class", "zoom-icon zoom-out")
           .on("click", () => {
               svg.transition().call(zoom.scaleBy, 0.5);
           })
           .html('<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" width="16" height="16"><path d="M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z"/></svg>');

       const zoom = d3.zoom()
           .scaleExtent([0.5, 8])
           .on("zoom", (event) => {
               svg.attr("transform", event.transform);
           });

       svg.call(zoom);
   } catch (error) {
       console.error('Error creating visualization:', error);
   }
}
}
  
  // Fetch data from FastAPI endpoint
  fetch('http://localhost:8000/read_dataset')
    .then(response => response.json())
    .then(data => {
      const heartRateStepsVisualizer = new HeartRateStepsRelationshipVisualizer(data.data);
      heartRateStepsVisualizer.createVisualization();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  