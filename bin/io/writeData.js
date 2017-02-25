var fs = require('fs')
var helpers = require('./helpers.js')
var makeDirectories = require('./makeDirectories.js')

function writeData (outPath, data, opts, cb) {
  var formattedData = helpers.formatData(outPath, data)
  if (opts.makeDirectories) {
    makeDirectories(outPath, proceed)
  } else {
    proceed()
  }
  function proceed (err) {
    if (err) {
      cb(err)
    }
    fs.writeFile(outPath, formattedData, function (err) {
      cb(err, formattedData)
    })
  }
}

module.exports = writeData
