var path = require('path')
var mkdirp = require('mkdirp')

function makeDirectoriesSync (outPath) {
  mkdirp.sync(path.dirname(outPath))
}

module.exports = makeDirectoriesSync
