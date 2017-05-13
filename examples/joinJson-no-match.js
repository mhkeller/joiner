// --------------------------------------------
//
// Attach joined data onto a nested key
//
// --------------------------------------------
var fs = require('fs')
var joiner = require('../dist/joiner.node.js')

var data = JSON.parse(fs.readFileSync('examples/data/left-data.json', 'utf-8'))
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

var newData = JSON.parse(fs.readFileSync('examples/data/no-match-data.json', 'utf-8'))
/*
[
  {
    "state_name": "VT",
    "avg_temp": 20
  },
  {
    "state_name": "TX",
    "avg_temp": 78
  },
  {
    "state_name": "OH",
    "avg_temp": 62
  }
]
*/

var joinedData = joiner({
  leftData: data,
  leftDataKey: 'name',
  rightData: newData,
  rightDataKey: 'state_name'
})

console.log(JSON.stringify(joinedData))

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
      "avg_temp": 38
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
        "CO",
        "NM",
        "UT",
        "WY"
      ],
      "b": [
        "CO",
        "NM",
        "UT",
        "WY"
      ],
      "a_and_b": [
        "CO",
        "NM",
        "UT",
        "WY"
      ],
      "a_not_in_b": [],
      "b_not_in_a": []
    },
    "prose": {
      "summary": "100%, one-to-one match of 4 rows!",
      "full": "Matches in A and B: CO, NM, UT, WY"
    },
    "matchStatus": "perfect"
  }
}
*/
