var dsv = require('d3-dsv')
var dbf = require('dbf')

function reportParseError (format) {
  console.error('[joiner] Error converting your data to ' + format + '. Your data most likely contains objects or lists. Object values can only be strings for this format. Please convert before writing to file.')
}

var formatters = {
  json: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    return JSON.stringify(file, writeOptions.replacer, writeOptions.indent)
  },
  csv: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    try {
      return dsv.csvFormat(file, writeOptions.columns)
    } catch (err) {
      reportParseError('csv')
    }
  },
  tsv: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    try {
      return dsv.tsvFormat(file, writeOptions.columns)
    } catch (err) {
      reportParseError('tsv')
    }
  },
  psv: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    try {
      return dsv.dsvFormat('|').format(file, writeOptions.columns)
    } catch (err) {
      reportParseError('psv')
    }
  },
  txt: function (d) { return d },
  dbf: function (file, writeOptions) {
    writeOptions = writeOptions || {}
    function toBuffer (ab) {
      var buffer = new Buffer(ab.byteLength)
      var view = new Uint8Array(ab)
      for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i]
      }
      return buffer
    }
    var buf = dbf.structure(file)
    return toBuffer(buf.buffer)
  }
}

module.exports = formatters
