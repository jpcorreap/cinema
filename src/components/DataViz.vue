<template>
    <label for="order" class="block text-sm font-medium text-gray-700">Sort by:</label>
    <select id="order" v-model="selectedOrder" @change="updateChart" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
        <option value="hourly">Hour</option>
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
    </select>
    <div id="chart"></div>
</template>

<script>
import * as d3 from 'd3';

const data = [
    {letter: "8:00", frequency: 8},
    {letter: "10:00", frequency: 15},
    {letter: "12:00", frequency: 3},
    {letter: "14:00", frequency: 5},
    {letter: "16:00", frequency: 15},
    {letter: "18:00", frequency: 20},
    {letter: "20:00", frequency: 17},
    {letter: "22:00", frequency: 5}
];

export default {
  name: 'DataViz',
  data() {
    return {
      selectedOrder: 'hourly', // Default sort order
      svg: null
    };
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
        const width = 640;
        const height = 200;
        const marginTop = 20;
        const marginRight = 0;
        const marginBottom = 30;
        const marginLeft = 40;

        const x = d3.scaleBand()
            .domain(data.map(d => d.letter))
            .range([marginLeft, width - marginRight])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.frequency)]).nice()
            .range([height - marginBottom, marginTop]);

        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, width, height])
            .attr("style", `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`);

        const bar = svg.append("g")
            .attr("fill", "green")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x(d.letter))
            .attr("y", d => y(d.frequency))
            .attr("height", d => y(0) - y(d.frequency))
            .attr("width", x.bandwidth());

        const xAxis = d3.axisBottom(x).tickSizeOuter(0);
        const gx = svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(xAxis);

        const gy = svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).tickFormat((y) => (y).toFixed()))
            .call(g => g.select(".domain").remove());

        document.getElementById('chart').appendChild(svg.node());

        document.getElementById('order').addEventListener('change', (event) => {
            const sortOrder = event.target.value;
            let sortFunction;

            switch (sortOrder) {
                case 'hourly':
                    sortFunction = (a, b) => a.letter.localeCompare(b.letter);
                    break;
                case 'ascending':
                    sortFunction = (a, b) => a.frequency - b.frequency;
                    break;
                case 'descending':
                    sortFunction = (a, b) => b.frequency - a.frequency;
                    break;
            }

            data.sort(sortFunction);
            x.domain(data.map(d => d.letter));

            const t = svg.transition().duration(750);
            bar.data(data, d => d.letter)
                .order()
                .transition(t)
                .attr("x", d => x(d.letter));

            gx.transition(t)
                .call(xAxis)
                .selectAll(".tick")
                .delay((d, i) => i * 20);
        })
    }
  }
};
</script>



<style scoped>
.bar {
  fill: steelblue;
}
</style>