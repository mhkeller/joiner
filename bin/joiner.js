#!/usr/bin/env node

var fs       = require('fs'),
		dsv      = require('dsv'),
		optimist = require('optimist'),
		_        = require('underscore'),
		joiner   = require('../src/joiner.js');

var argv = optimist
  .usage('Usage: joiner -a FILE_PATH -k DATASET_A_KEY -b FILE_PATH -l DATASET_B_KEY -m (json|geojson) -n NEST_ID -o OUT_FILE_PATH -d (summary|full)')
  .options('h', {
    alias: 'help',
    describe: 'Display help',
    default: false
  })
  .options('a', {
    alias: 'adata',
    describe: 'Dataset A',
    default: null
  })
  .options('k', {
    alias: 'akey',
    describe: 'Dataset A key',
    default: null
  })
  .options('b', {
    alias: 'bdata',
    describe: 'Dataset B',
    default: null
  })
  .options('l', {
    alias: 'bkey',
    describe: 'Dataset B key',
    default: null
  })
  .options('m', {
    alias: 'mode',
    describe: 'json or geojson',
    default: 'json'
  })
  .options('n', {
    alias: 'nester',
    describe: 'Nested id',
    default: false
  })
  .options('o', {
    alias: 'out',
    describe: 'Out file',
    default: false
  })
  .options('r', {
    alias: 'report',
    describe: 'Report format',
    default: 'summary'
  })
  .check(function(argv) {
    if ( (!argv['a'] || !argv['adata']) &&  (!argv['a'] || !argv['adata']) && (!argv['b'] || !argv['bdata']) && (!argv['k'] || !argv['akey']) && (!argv['l'] || !argv['bkey']) ) throw 'What do you want to do?';
  })
  .argv;

if (argv.h || argv.help) return optimist.showHelp();

var adata        = argv.a  || argv['adata'],
		akey         = argv.k  || argv['akey'],
		bdata        = argv.b  || argv['bdata'],
 		bkey         = argv.l  || argv['bkey'],
 		format       = argv.m  || argv['mode'],
 		nester       = argv.n  || argv['nester'],
 		out_file     = argv.o  || argv['out'],
 		report_desc  = argv.r  || argv['report'];

// Given a file name, get its extension
function discernFormat(file_name) {
  var name_arr = file_name.split('\.')
  format_name = name_arr[name_arr.length - 1];
  return format_name
}

function discernFileFormatter(file_name){
	var format    = discernFormat(file_name);
	var formatMap = {
		json: function(file){
			return JSON.stringify(file)
		},
		csv: function(file){
			return dsv.csv.format(file)
		},
		tsv: function(file){
			return dsv.tsv.format(file)
		},
		psv: function(file){
			return dsv.dsv('|').format(file)
		}
	}
	return formatMap[format]
}

function writeDataSync(file_path, data){
	var fileFormatter = discernFileFormatter(file_path);
	fs.WriteFileSync(file_path, fileFormatter(data))
}

function writeReportSync(file_path, report){
	file_path = JSON.stringify(file_path.replace(discernFormat(file_path), '').replace('.','') + '-report.json')
	fs.WriteFileSync(file_path, report)
}


// Given a file name, return teh appropriate date parser
function discernParser(file_name) {
  var format = discernFormat(file_name);
  var parserMap = {
    json: JSON.parse,
    csv: dsv.csv.parse,
    tsv: dsv.tsv.parse,
    psv: dsv.dsv('|').parse
  }
  return parserMap[format]
}

// Parse data
var aparser = discernParser(adata),
		bparser = discernParser(bdata);
adata = aparser(adata)
bdata = bparser(bdata)

// Join data
var jd;
if (format != 'geojson'){
	jd = joiner.left(adata, akey, bdata, bkey, nester)
}else{
	jd = joiner.geoJson(adata, akey, bdata, bkey, nester)
}

if (out_file){
	writeDataSync(out_file, jd.data)
	writeReportSync(out_file, jd.report)
}else{
	if (report_desc == 'summary'){
		console.log(jd.report.prose.summary)
	}else{
		console.log(jd.report.prose.full)
	}
}


