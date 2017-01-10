// --------------------------------------------
//
// Join data when the keys are nested
//
// --------------------------------------------

var fs = require('fs')
var joiner = require('../src/index.js')

var data = JSON.parse(fs.readFileSync('examples/data/left-data-nested-four.json'))
/*
[
  {
    "id": "1",
    "name": "UT",
    "values": {
      "name": "Utah"
    }
  }, {
    "id": "2",
    "name": "WY",
    "values": {
      "name": "Wyoming"
    }
  }, {
    "id": "3",
    "name": "CO",
    "values": {
      "name": "Colorado"
    }
  }, {
    "id": "4",
    "name": "NM",
    "values": {
      "name": "New Mexico"
    }
  }
]
*/
var newData = JSON.parse(fs.readFileSync('examples/data/new-data-three.json'))
/*
[
  {
    "type": "state",
    "data": {
      "state_name": "Colorado",
      "avg_temp": 34
     }
  },
  {
    "type": "state",
    "data": {
      "state_name": "Utah",
      "avg_temp": 72
     }
  },
  {
    "type": "state",
    "data": {
      "state_name": "New Mexico",
      "avg_temp": 45
     }
  }
]
*/

var joinedData = joiner({
  leftData: data,
  leftDataKey: 'values.name',
  rightData: newData,
  rightDataKey: 'data.state_name'
})

console.log(JSON.stringify(joinedData))

/*
{
  "data": [
    {
      "id": "1",
      "name": "UT",
      "values": {
        "name": "Utah"
      },
      "type": "state",
      "data": {
        "avg_temp": 72
      }
    },
    {
      "id": "2",
      "name": "WY",
      "values": {
        "name": "Wyoming"
      },
      "type": null,
      "data": null
    },
    {
      "id": "3",
      "name": "CO",
      "values": {
        "name": "Colorado"
      },
      "type": "state",
      "data": {
        "avg_temp": 34
      }
    },
    {
      "id": "4",
      "name": "NM",
      "values": {
        "name": "New Mexico"
      },
      "type": "state",
      "data": {
        "avg_temp": 45
      }
    }
  ],
  "report": {
    "diff": {
      "a": [
        "Utah",
        "Wyoming",
        "Colorado",
        "New Mexico"
      ],
      "b": [
        "Colorado",
        "Utah",
        "New Mexico"
      ],
      "a_and_b": [
        "Utah",
        "Colorado",
        "New Mexico"
      ],
      "a_not_in_b": [
        "Wyoming"
      ],
      "b_not_in_a": []
    },
    "prose": {
      "summary": "3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.",
      "full": "Matches in A and B: Utah, Colorado, New Mexico. A not in B: Wyoming."
    }
  }
}
*/
