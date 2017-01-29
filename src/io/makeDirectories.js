var path = require('path')
var mkdirp = require('mkdirp')

function makeDirectories (outPath, cb) {
  mkdirp(path.dirname(outPath), function (err) {
    cb(err)
  })
}

module.exports = makeDirectories
