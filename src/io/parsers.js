var dsv = require('d3-dsv')

var parsers = {
  json: function (str) {
    return JSON.parse(str)
  },
  csv: function (str) {
    return dsv.csvParse(str)
  },
  tsv: function (str) {
    return dsv.tsvParse(str)
  },
  psv: function (str) {
    return dsv.dsvFormat('|').parse(str)
  }
}

// Aliases
parsers.geojson = parsers.json
parsers.topojson = parsers.json

module.exports = parsers
