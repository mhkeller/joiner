var fs = require('fs')
var joiner = require('../src/index.js')

var data = JSON.parse(fs.readFileSync('examples/data/left-data.json'))
/*
[
  {
    "id": "1",
    "name": "UT"
  }, {
    "id": "2",
    "name": "WY"
  }, {
    "id": "3",
    "name": "CO"
  }, {
    "id": "4",
    "name": "NM"
  }
]
*/
var newData = JSON.parse(fs.readFileSync('examples/data/new-data.json'))
/*
[
  {
    "state_name": "CO",
    "avg_temp": 34
  },
  {
    "state_name": "UT",
    "avg_temp": 72
  },
  {
    "state_name": "NM",
    "avg_temp": 45
  }
]
*/

var joinedData = joiner.left({
  leftData: data,
  leftDataKey: 'name',
  rightData: newData,
  rightDataKey: 'state_name'
})

console.log(joinedData)

/*
{
  "data": [
    {
      "id": "1",
      "name": "UT",
      "avg_temp": 72
    },
    {
      "id": "2",
      "name": "WY",
      "avg_temp": null
    },
    {
      "id": "3",
      "name": "CO",
      "avg_temp": 34
    },
    {
      "id": "4",
      "name": "NM",
      "avg_temp": 45
    }
  ],
  "report": {
    "diff": {
      "a": [
        "UT",
        "WY",
        "CO",
        "NM"
      ],
      "b": [
        "CO",
        "UT",
        "NM"
      ],
      "a_and_b": [
        "UT",
        "CO",
        "NM"
      ],
      "a_not_in_b": [
        "WY"
      ],
      "b_not_in_a": []
    },
    "prose": {
      "summary": "3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.",
      "full": "Matches in A and B: UT, CO, NM. A not in B: WY."
    }
  }
}
*/
