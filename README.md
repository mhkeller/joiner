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
	summary: [summary description of join result, matches in A and B, A not in B, B not in A.]
	full:    [full list of which rows were joined in each of the above categories]
}
````

__.left__ _.left(left_data, left_data_key, right_data, right_data_key, [nested_key_name])_

Perform a left join on the two array-of-object json datasets. Optionally, you can pass in a key name in case the left data's attribute dictionary is nested, such as in GeoJson where the attributes are under a `properties` object.


__.geoJson__ _.geoJson(left_data, left_data_key, right_data, right_data_key, 'properties')

Does the same thing as __.left__ but passes in `properties` as the nested key name.

## Reports

Joiner also creates join reports so you can know how successful a given join is.

They take t

## Usage

See the [`examples`](https://github.com/mhkeller/joiner/examples) folder.


## TODOs

* Create web-interface