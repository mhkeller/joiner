var fs = require('fs')

module.exports = readFile

function readFile (path, cb) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      cb(err)
      return false
    }
    cb(null, data)
  })
}
