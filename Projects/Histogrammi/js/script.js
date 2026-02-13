async function drawChart() {
  const dataset = await d3.json("../data/my_weather_data.json");

  const convertToCelsius = (f) => (f - 32) * (5 / 9);

  // 1. Responsiivisuus
  const width = d3.min([window.innerWidth * 0.9, 800]);
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: { top: 50, right: 30, bottom: 60, left: 60 },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const drawHistogram = (metric) => {
    d3.select("#wrapper").html("");

    // 2. Metrijärjestelmä
    const metricAccessor = (d) => {
      const val = d[metric];
      return metric.toLowerCase().includes("temperature")
        ? convertToCelsius(val)
        : val;
    };

    const yAccessor = (d) => d.length;

    const wrapper = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const boundingBox = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
      );

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice();

    const binGenerator = d3
      .bin()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12);

    const bins = binGenerator(dataset);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice();

    // Palkit
    const barPadding = 2;
    const barGroups = boundingBox
      .selectAll("g")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "barGroup");

    barGroups
      .append("rect")
      .attr("x", (d) => xScale(d.x0) + barPadding / 2)
      .attr("y", (d) => yScale(yAccessor(d)))
      .attr("width", (d) =>
        d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]),
      )
      .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", "#203354");

    // 3. Keskiarvoviiva ja label
    const mean = d3.mean(dataset, metricAccessor);
    boundingBox
      .append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -10)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "#d4af37")
      .attr("stroke-width", 2)
      .style("stroke-dasharray", "4px 2px");

    boundingBox
      .append("text")
      .attr("x", xScale(mean))
      .attr("y", -15)
      .text(`Mean: ${mean.toFixed(1)}`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#d4af37");

    // Akselit
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = boundingBox
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);

    xAxis
      .append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(metric === "temperatureMax" ? "Max Temperature (°C)" : metric);
  };

  // Interaktio
  const metrics = [
    "temperatureMax",
    "humidity",
    "pressure",
    "windSpeed",
    "visibility",
  ];
  let metricIndex = 0;
  d3.select("#button").on("click", (e) => {
    e.preventDefault();
    metricIndex = (metricIndex + 1) % metrics.length;
    drawHistogram(metrics[metricIndex]);
  });

  drawHistogram(metrics[metricIndex]);
}
drawChart();
