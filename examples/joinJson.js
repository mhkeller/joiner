var joiner = require('../src/joiner.js');

var data_key   = 'name',
		new_data_key = 'state_name';

var data = [ 
		{
			"name": 'AK',
			"geom": '1'
		},{ 
			"name": 'CA',
			"geom": '2'
		},{ 
			"name": 'NY',
			"geom": '3'
		},{
			"name": 'LA',
			"geom": '4'
		}
	]

var new_data = [ 
		{
			"state_name": 'AK',
			"avg_temp": 34
		}, 
		{
			"state_name": 'CA',
			"avg_temp": 72
		}, 
		{
			"state_name": 'NY',
			"avg_temp": 45
		}
	]

var joined_data = joiner.left(data, data_key, new_data, new_data_key)
console.log(joined_data)

/*
{
  "data": [
    {
      "name": "AK",
      "geom": "1",
      "avg_temp": 34
    },
    {
      "name": "CA",
      "geom": "2",
      "avg_temp": 72
    },
    {
      "name": "NY",
      "geom": "3",
      "avg_temp": 45
    },
    {
      "name": "LA",
      "geom": "4",
      "avg_temp": null
    }
  ],
  "report": {
    "diff": {
      "a": [
        "AK",
        "CA",
        "NY",
        "LA"
      ],
      "b": [
        "AK",
        "CA",
        "NY"
      ],
      "a_and_b": [
        "AK",
        "CA",
        "NY"
      ],
      "a_not_in_b": [
        "LA"
      ],
      "b_not_in_a": []
    },
    "prose": {
      "summary": "3 rows matched in A and B. 1 rows in A not in B. All 3 rows in B in A. ",
      "full": "Matches in A and B: AK, CA, NY. A not in B: LA. "
    }
  }
}

*/