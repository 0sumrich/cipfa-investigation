import "./style.css";
import csvData from './data/cipfa_issues_v_stock.csv'
import figures from './data/figures.json'
import { draw } from './functions/draw'
// import lineData from './functions/lineData'
import scatterData from './functions/scatterData'
import { initialiseOptions } from './functions/options'
import { select, selectAll } from 'd3-selection'
import Plotly from 'plotly.js-dist-min'
const d3 = { select, selectAll }

const initialOption = 'Adult Fiction'
const chartData = scatterData(csvData, initialOption)
initialiseOptions(csvData, initialOption)
draw(chartData)

// add plotly divs
d3.select('main .container')
    .selectAll('.chart-container')
    .data(Object.keys(figures))
    .enter()
    .append('div')
    .attr('class', 'chart-container')
    .append('div')
    .attr('id', d => d)

for (const id of Object.keys(figures)) {
    const { data, layout } = figures[id]
    layout.autosize = true
    const config = { responsive: true }
    Plotly.newPlot(id, { data, layout, config })
}