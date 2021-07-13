import { scaleLinear, scaleTime } from 'd3-scale'
import { select, pointers } from 'd3-selection'
import { extent } from 'd3-array'
import { line } from 'd3-shape'
import { axisBottom, axisLeft } from 'd3-axis'
import { schemeCategory10 } from 'd3-scale-chromatic'
import createTrend from 'trendline';
const d3 = {
    axisBottom,
    axisLeft,
    extent,
    line,
    scaleLinear,
    scaleTime,
    select,
    pointers
}

const colorCategories = [
    "Others",
    "Barnet",
    "Comparitor authority",
    "Outlier"
].sort()
const colors = schemeCategory10
const getColor = category => colors[colorCategories.indexOf(category)]

function sortData(a, b) {
    if (b.legend < a.legend) {
        return -1;
    }
    if (b.legend > a.legend) {
        return 1;
    }
    return 0;
}

export function draw(initData) {
    // put barnet and comparitors on top - fortunatley they're alphabetical
    const data = initData.sort(sortData)
    const div = d3.select(".tooltip")
    const w = 950
    const h = 500
    const margin = { top: 50, right: 200, bottom: 50, left: 100 };
    const width = w - margin.left - margin.right;
    const height = h - margin.top - margin.bottom;
    // x is stock
    const stock = data.map(o => o.Stock)
    const [xmin, xmax] = d3.extent(stock)
    const x = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width])
    // y is issues
    const issues = data.map(o => o.Issues)
    const [ymin, ymax] = d3.extent(issues)
    const y = d3.scaleLinear()
        .domain([0, ymax])
        .range([height, 0]);

    const chart = d3
        .select("#chart")
        .attr('viewBox', `0 0 ${w} ${h}`)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    chart.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('r', 2.5)
        .attr('cx', d => x(d.Stock))
        .attr('cy', d => y(d.Issues))
        .style('fill', d => getColor(d.legend))
        .on('mouseover', (e, d) => {
            const pTag = text => `<p>${text}</p>`
            const localAuthority = pTag(`<strong>${d.Authority}</strong>`)
            const issues = pTag(`Issues: ${Math.round(d.Issues)}`)
            const stock = pTag(`Stock: ${Math.round(d.Stock)}`)
            const htmlString = localAuthority + issues + stock
            div
                .style("opacity", .9)
                .html(htmlString)
                .style("left", `${e.pageX}px`)
                .style("top", `${e.pageY - 5}px`);
        })
        .on('mouseout', () => div.style('opacity', 0))

    // trendline
    const trend = createTrend(data.filter(o => o.legend !== 'Outlier'), 'Stock', 'Issues');
    chart.append('line')
        .attr('x1', x(xmin))
        .attr('y1', y(trend.calcY(xmin)))
        .attr('x2', x(xmax))
        .attr('y2', y(trend.calcY(xmax)))
        .attr('stroke', colors[colorCategories.length])
        .attr('stroke-width', 1)
    // axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
    chart
        .append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chart
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);

    chart
        .append("text")
        .attr("class", "legend")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Stock count");

    chart
        .append("text")
        .attr("class", "legend")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 0.75 * margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Loans count");

    const legend = chart.append('g')
        .attr('class', 'legend-box')
        .attr('transform', `translate(${width + 10}, 0)`)

    legend.selectAll('legend-circle')
        .data(colorCategories)
        .enter()
        .append('circle')
        .attr('r', 2.5)
        .attr('cx', 10)
        .attr('cy', (d, i) => 15 * i)
        .style('fill', d => getColor(d))

    legend.selectAll('text')
        .data(colorCategories)
        .enter()
        .append('text')
        .attr('x', 20)
        .attr('y',(d, i) => 15 * i)
        .attr('alignment-baseline', 'middle')
        .text(d => d)
}

function clear(id) {
    d3
        .select("#" + id)
        .selectAll("*")
        .remove();
}

export function redraw(data) {
    clear('chart')
    draw(data)
}

