// --------------------------------------------
//
// Browser-implementations of NodeJS path module, courtesy Rich Harris
// https://github.com/rollup/rollup/blob/master/browser/path.js
//
// --------------------------------------------

function basename (path) {
  return path.split(/(\/|\\)/).pop()
}

function extname (path) {
  const match = /\.[^.]+$/.exec(basename(path))
  if (!match) return ''
  return match[0]
}

module.exports = {
  basename: basename,
  extname: extname
}
