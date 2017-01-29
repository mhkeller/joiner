var fs = require('fs')
var helpers = require('./helpers.js')
var makeDirectoriesSync = require('./makeDirectoriesSync.js')

function writeDataSync (outPath, data, opts) {
  var formattedData = helpers.formatData(outPath, data)
  if (opts.makeDirectories) {
    makeDirectoriesSync(outPath)
  }
  fs.writeFileSync(outPath, formattedData)
}

module.exports = writeDataSync
