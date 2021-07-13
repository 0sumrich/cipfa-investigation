import M from 'materialize-css'
import { select, selectAll } from 'd3-selection'
import { redraw } from './draw'
import scatterData from './scatterData'
const d3 = { select, selectAll }

const selector = id => `#${id} select`

const getSelectValue = id => d3.select(selector(id)).property('value')

function setOptions(array, selected, id) {
    d3.select(selector(id))
        .selectAll('option')
        .data(array)
        .join('option')
        .property('selected', d => d == selected)
        .attr('value', d => d)
        .text(d => d)

    M.FormSelect.init(d3.select(selector(id)).node(), {});
}

function addEventListeners(data, id) {
    // dropdown change
    d3.select(selector(id))
        .on('change', e => {
            const option = e.target.value
            redraw(scatterData(data, option))
        })
}

const unique = (array, key) => [...new Set(array.map(o => o[key]))]

export function initialiseOptions(initData, initialValue) {
    const options = unique(initData, 'variable')
    setOptions(options, initialValue, 'item_type_dropdown')
    // add event listeners
    addEventListeners(initData, 'item_type_dropdown')
}