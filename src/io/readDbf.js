var shapefile = require('shapefile')

module.exports = readDbf

function readDbf (path, cb) {
  var values = []
  shapefile.openDbf(path)
    .then(function (source) {
      return source.read()
      .then(function log (result) {
        if (result.done) return cb(null, values)
        values.push(result.value)
        return source.read().then(log)
      })
    })
    .catch(function (error) {
      return cb(error.stack)
    })
}
