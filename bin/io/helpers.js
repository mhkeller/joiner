var path = require('./path.js')
var formatters = require('./formatters.js')

function formatData (outPath, data) {
  var ext = discernFormat(outPath)
  return formatters[ext](data)
}

function discernFormat (fileName) {
  var extension = path.extname(fileName)
  if (extension === '') return false

  var formatName = extension.slice(1)
  return formatName
}

module.exports = {
  discernFormat: discernFormat,
  formatData: formatData
}
