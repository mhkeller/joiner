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

var newData = JSON.parse(fs.readFileSync('examples/data/perfect-new-data.json', 'utf-8'))
/*
[
  {
    "state_name": "UT",
    "avg_temp": 72
  },
  {
    "state_name": "WY",
    "avg_temp": 38
  },
  {
    "state_name": "CO",
    "avg_temp": 34
  },
  {
    "state_name": "NM",
    "avg_temp": 45
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
      "full": "No matches. A not in B: CO, NM, UT, WY. B not in A: OH, TX, VT."
    },
    "matchStatus": "none"
  }
}
*/
