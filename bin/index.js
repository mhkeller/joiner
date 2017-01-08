#!/usr/bin/env node

var io = require('indian-ocean')
var optimist = require('optimist')
var joiner = require('../src/index.js')
var queue = require('d3-queue').queue

var argv = optimist
  .usage('Usage: joiner -a DATASET_A_PATH -k DATASET_A_KEY -b DATASET_B_PATH -l DATASET_B_KEY -m (json|geojson) -n NEST_ID -o OUT_FILE_PATH -d (summary|full)')
  .options('h', {
    alias: 'help',
    describe: 'Display help',
    default: false
  })
  .options('a', {
    alias: 'apath',
    describe: 'Dataset A path',
    default: null
  })
  .options('k', {
    alias: 'akey',
    describe: 'Dataset A key',
    default: null
  })
  .options('b', {
    alias: 'bpath',
    describe: 'Dataset B path',
    default: null
  })
  .options('l', {
    alias: 'bkey',
    describe: 'Dataset B key',
    default: null
  })
  .options('g', {
    alias: 'geojson',
    describe: 'Are you joining geojson?',
    default: false,
    boolean: true
  })
  .options('p', {
    alias: 'path',
    describe: 'Nested path id',
    default: null
  })
  .options('o', {
    alias: 'out',
    describe: 'Out path',
    default: null
  })
  .options('r', {
    alias: 'report',
    describe: 'Report format',
    default: 'summary'
  })
  .check(function (argv) {
    if ((!argv['a'] || !argv['adata']) && (!argv['a'] || !argv['adata']) && (!argv['b'] || !argv['bdata']) && (!argv['k'] || !argv['akey']) && (!argv['l'] || !argv['bkey'])) {
      throw 'What do you want to do?' // eslint-disable-line no-throw-literal
    }
  })
  .argv

if (argv.h || argv.help) {
  optimist.showHelp()
}

var aPath = argv.a || argv['apath']
var aKey = argv.k || argv['akey']
var bPath = argv.b || argv['bpath']
var bKey = argv.l || argv['bkey']
var geojson = argv.g || argv['geojson']
var path = argv.p || argv['path']
var outPath = argv.o || argv['out']
var reportDesc = argv.r || argv['report']

var q = queue()

var loadFnA = getDbfOrDataLoader(aPath)
var loadFnB = getDbfOrDataLoader(bPath)

q.defer(loadFnA, aPath)
q.defer(loadFnB, bPath)

q.await(function (err, aData, bData) {
  if (err) {
    throw new Error(err)
  }
  var config = {
    leftData: aData,
    leftDataKey: aKey,
    rightData: bData,
    rightDataKey: bKey,
    path: path
  }

  var fn = geojson === true ? 'geoJson' : 'left'

  // Join data
  var jd = joiner[fn](config)
  if (outPath !== null) {
    io.writeData(outPath, jd.data, {makeDirectories: true}, function (err) {
      if (err) {
        console.error('Error writing data file', outPath)
        throw new Error(err)
      }
    })
    io.writeDataSync(stripExtension(outPath) + 'report.json', jd.report, {makeDirectories: true})
  } else {
    if (reportDesc === 'summary') {
      console.log(jd.report.prose.summary)
    } else {
      console.log(jd.report.prose.full)
    }
  }
})

function getDbfOrDataLoader (path) {
  return io.discernParser(path) === 'dbf' ? io.readDbf : io.readData
}

function stripExtension (fullPath) {
  var ext = io.discernFormat(fullPath)
  return fullPath.replace(new RegExp(ext + '$', 'g'), '')
}
