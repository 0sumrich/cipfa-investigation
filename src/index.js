import "./style.css";
import csvData from './cipfa_issues_v_stock.csv'
import { draw } from './functions/draw'
// import lineData from './functions/lineData'
import scatterData from './functions/scatterData'
import { initialiseOptions } from './functions/options'

const initialOption = 'Adult Fiction'
const chartData = scatterData(csvData, initialOption)
initialiseOptions(csvData, initialOption)
draw(chartData)
