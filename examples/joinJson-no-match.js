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
      "avg_temp": null
    },
    {
      "id": "2",
      "name": "WY",
      "avg_temp": null
    },
    {
      "id": "3",
      "name": "CO",
      "avg_temp": null
    },
    {
      "id": "4",
      "name": "NM",
      "avg_temp": null
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
        "OH",
        "TX",
        "VT"
      ],
      "a_and_b": [],
      "a_not_in_b": [
        "CO",
        "NM",
        "UT",
        "WY"
      ],
      "b_not_in_a": [
        "OH",
        "TX",
        "VT"
      ]
    },
    "prose": {
      "summary": "No matches. Try choosing different columns to match on.",
      "full": "A not in B: CO, NM, UT, WY. B not in A: OH, TX, VT."
    },
    "matchStatus": "none"
  }
}
*/
