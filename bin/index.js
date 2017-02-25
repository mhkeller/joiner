#!/usr/bin/env node

var optimist = require('optimist')
var joiner = require('../dist/joiner.node.js')
var queue = require('d3-queue').queue

var io = require('./io/index.js')

var argv = optimist
  .usage('Usage: joiner -a DATASET_A_PATH -k DATASET_A_KEY -b DATASET_B_PATH -j DATASET_B_KEY -o OUT_FILE_PATH [-r (summary|full) -n NEST_KEY --geojson]')
  .options('h', {
    alias: 'help',
    describe: 'Display help',
    default: false
  })
  .options('a', {
    alias: 'apath',
    describe: 'Dataset A path'
  })
  .options('k', {
    alias: 'akey',
    describe: 'Dataset A key'
  })
  .options('b', {
    alias: 'bpath',
    describe: 'Dataset B path'
  })
  .options('j', {
    alias: 'bkey',
    describe: 'Dataset B key'
  })
  .options('g', {
    alias: 'geojson',
    describe: 'Is dataset A geojson?',
    default: false,
    boolean: true
  })
  .options('n', {
    alias: 'nestkey',
    describe: 'Nested key name'
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
    if ((!argv['a'] || !argv['adata']) && (!argv['a'] || !argv['adata']) && (!argv['b'] || !argv['bdata']) && (!argv['k'] || !argv['akey']) && (!argv['j'] || !argv['bkey'])) {
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
var bKey = argv.j || argv['bkey']
var geojson = argv.g || argv['geojson']
var nestKey = argv.n || argv['nestkey']
var outPath = argv.o || argv['out']
var reportDesc = argv.r || argv['report']

var q = queue()

q.defer(io.readData, aPath)
q.defer(io.readData, bPath)

q.await(function (err, aData, bData) {
  console.log('adata', aData)
  console.log('bdata', bData)
  if (err) {
    throw new Error(err)
  }
  var config = {
    leftData: aData,
    leftDataKey: aKey,
    rightData: bData,
    rightDataKey: bKey,
    nestKey: nestKey,
    geoJson: geojson
  }

  // Join data
  var jd = joiner(config)
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

function stripExtension (fullPath) {
  var ext = io.helpers.discernFormat(fullPath)
  return fullPath.replace(new RegExp(ext + '$', 'g'), '')
}
