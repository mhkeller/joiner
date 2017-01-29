var helpers = require('./helpers.js')
var readDbf = require('./readDbf.js')
var readFile = require('./readFile.js')
var parsers = require('./parsers.js')

function readData (path, cb) {
  var readers = {
    csv: readFile,
    tsv: readFile,
    psv: readFile,
    json: readFile,
    geojson: readFile,
    topojson: readFile,
    shp: readDbf,
    dbf: readDbf
  }

  var ext = helpers.discernFormat(path)
  var reader = readers[ext]

  reader(path, function (err, result) {
    if (err) {
      cb(err)
    }
    var parser = parsers[ext] || function (d) { return d }
    cb(null, parser(result))
  })
}

module.exports = readData
