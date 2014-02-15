Joiner
======

A simple utility for SQL-like joins with Json or GeoJson data. Also creates join reports so you can know how successful a given join is.

## Installation

To install as a Node.js module:

````
npm install joiner
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
		b: [data in A],
		a_and_b: [data in A and B],
		a_not_in_b: [data in A not in B],
		b_not_in_a: [data in B not in A]
	}:
	prose: {
		summary: [summary description of join result, matches in A and B, A not in B, B not in A.]
		full:    [full list of which rows were joined in each of the above categories]
	}
}
````

__.left__ 

_.left(leftData, leftDataKey, rightData, rightDataKey, [nestedKeyName])_

Perform a left join on the two array-of-object json datasets. Optionally, you can pass in a key name in case the left data's attribute dictionary is nested, such as in GeoJson where the attributes are under a `properties` object.


__.geoJson__ 

_.geoJson(leftData, leftDataKey, rightData, rightDataKey, 'properties')_

Does the same thing as __.left__ but passes in `properties` as the nested key name.

It includes both a `summary`

## Usage

See the [`examples`](https://github.com/mhkeller/joiner/examples) folder.

As you can see, it puts a lot of data in memory, so it's probably best to avoid very large datasets.

## TODOs

* Create web-interface
