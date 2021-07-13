export default function scatterData(data, option) {
    return data.filter(d => d.variable===option)
}
