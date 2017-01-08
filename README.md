Joiner
======

[![Build Status](https://secure.travis-ci.org/mhkeller/joiner.png?branch=master&style=flat-square)](http://travis-ci.org/mhkeller/joiner) [![NPM version](https://badge.fury.io/js/joiner.png?style=flat)](http://badge.fury.io/js/joiner) [![npm](https://img.shields.io/npm/dm/joiner.svg)](https://www.npmjs.com/package/joiner)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A simple utility for SQL-like joins with Json or GeoJson data. Also creates join reports so you can know how successful a given join is.

## Installation

To install as a Node.js module:

````
npm install --save joiner
````

Or to install as a command-line utility:

````
npm install joiner -g
````

To use as both, run both commands.

## Methods

All methods return an object with the following structure:

````
data: [data object],
report: {
	diff: {
		a: [data in A],
		b: [data in B],
		a_and_b: [data in A and B],
		a_not_in_b: [data in A not in B],
		b_not_in_a: [data in B not in A]
	}:
	prose: {
		summary: [summary description of join result, number of matches in A and B, A not in B, B not in A.]
		full:    [full list of which rows were joined in each of the above categories]
	}
}
````

### .left(config)

Perform a left join on the two array of object json datasets. It performs a [deep clone](https://www.npmjs.com/package/lodash.clonedeep) of the objects you pass in and returns the new object. Optionally, you can pass in a key name under `nestKey` in case the left data's attribute dictionary is nested.

| parameter    | type     | description    |
| :------------|:-------- |:---------------|
| leftData     | Array    | existing data  |
| leftDataKey  | String   | key to join on |
| rightData    | Array    | new data       |
| rightDataKey | String   | key to join on |
| nestKey      | [String] | optional, key name holding attribute |


### .geoJson(config)

Performs a left join onto the `properties` object of each feature in a geojson array. It performs a deep clone using [lodash.clonedeep](https://www.npmjs.com/package/lodash.clonedeep) of the objects you pass in and returns the new object.

By default it will join on the `id` property. You can also join on a value in the `properties` object by setting `leftDataKey` to the desired key name and `nestKey` to the string `'properties'`.

| parameter    | type     | description    |
| -------------|--------- |----------------|
| leftData     | Array    | existing data  |
| leftDataKey  | [String] default='id'| Optional, key to join on |
| rightData    | Array    | new data       |
| rightDataKey | String   | key to join on |
| nestKey      | [String] | optional, key name holding attribute |

## Usage

See the [`examples`](https://github.com/mhkeller/joiner/tree/master/examples) folder.

## Command line interface

````
Usage: joiner -a DATASET_A_PATH -k DATASET_A_KEY -b DATASET_B_PATH -j DATASET_B_KEY -o OUT_FILE_PATH [-r (summary|full) -n NEST_KEY --geojson]

Options:
  -h, --help     Display help           [default: false]
  -a, --apath    Dataset A path
  -k, --akey     Dataset A key
  -b, --bpath    Dataset B path
  -j, --bkey     Dataset B key
  -g, --geojson  Is dataset A geojson?  [default: false]
  -n, --nestkey  Nested key name
  -o, --out      Out path
  -r, --report   Report format          [default: "summary"]

````

In most cases, the first four parameters (`--apath`, `--akey`, `--bpath` and `--bkey`) are required. `--akey` is not required if you have set geojson to true by using `-g` or `--geojson` since it will join on the `"id"` field. If you want to join on a property field in geojson, then set that using `--akey`.

If you specify an output file, it will write the join result to the specified file and the report to the same directory. Intermediate directories will be created if they don't already exist. For example, `-o path/to/output.csv` will also write `-o path/to/output-report.json` and create the `to/` folder if it isn't already there. If you don't specify an output file, it will print the results to the console.

If you don't specify an output file with `-o`, Joiner will print the join report to the console. By default, it will just specify the summary report. To print the full report, specify `-d full`.

Setting `-g` or `--geojson` is the equivalent of `.geoJson` above.

It converts the specified input file into json and writes the joined dataset to file using [indian ocean](https://github.com/mhkeller/indian-ocean), which currently supports the following formats: `json`, `geojson`, `csv`, `psv`, `tsv` and `dbf`. The format is inferred from the file extension of the input and output file paths. For example, `-a path/to/input/file.csv` will read in a csv and `-o path/to/output/file.csv` will write a csv.
