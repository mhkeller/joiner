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

Perform a left join on the two array of object json datasets. Optionally, you can pass in a key name under `path` in case the left data's attribute dictionary is nested.

| parameter    | type     | description    |
| :------------|:-------- |:---------------|
| leftData     | Array    | existing data  |
| leftDataKey  | String   | key to join on |
| rightData    | Array    | new data       |
| rightDataKey | String   | key to join on |
| path         | [String] | optional, key name of attribute |


### .geoJson(config)

Performs a left join on the `properties` object of each feature in a geojson array. By default it will join on the `id` property. You can also join on a value in the `properties` object by setting `leftDataKey` to the desired key name and `path` to the string `'properties'`.

| parameter    | type     | description    |
| -------------|--------- |----------------|
| leftData     | Array    | existing data  |
| leftDataKey  | [String] default='id'| Optional, key to join on |
| rightData    | Array    | new data       |
| rightDataKey | String   | key to join on |
| path         | [String] | optional, key name of attribute |

## Usage

See the [`examples`](https://github.com/mhkeller/joiner/tree/master/examples) folder.

As you can see, it puts a lot of data in memory, so it's probably best to avoid very large datasets.

## Command line interface

````
Usage: joiner
		-a DATASET_A_PATH
		-k DATASET_A_KEY
		-b DATASET_B_PATH
		-l DATASET_B_KEY
		-f (json|geojson) # defaults to `json`
		-p NESTED_PATH_ID
		-o OUT_FILE_PATH # Where to save the file, will write intermediate directories if they don't exist
		-d (summary|full) # defaults to `summary`
````

The first four parameters, `-a`, `-k`, `-b` and `-l` are required.

If you specify an output file, it will write the join result to the specified path and the report to the same directory, creating directories if they don't already exist. For example, `-o path/to/output.csv` will also write `-o path/to/output-report.json`.

`-f` defaults to `json`. `-f geojson` acts the same as the `.geoJson` method above.

Supported input and output formats: `json`, `csv`, `csv`, `psv`. Format will be inferred from the file ending on both input and output file paths. For example, `-a path/to/input/file.csv` will read in a csv. `-o path/to/output/file.csv` will write a csv.

If you don't specify an output file with `-o`, Joiner will print the join report to the console. By default it will just specify the summary report. To print the full report, specify `-d full`.
