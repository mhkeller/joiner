// --------------------------------------------
//
// Attach joined data onto a nested key
//
// --------------------------------------------
var fs = require('fs')
var joiner = require('../src/index.js')

var data = JSON.parse(fs.readFileSync('examples/data/left-data-nested-three.json'))
/*
[
  {
    "id": "1",
    "name": "Utah",
    "values": {
      "weather": {}
    }
  }, {
    "id": "2",
    "name": "Wyoming",
    "values": {
      "weather": {}
    }
  }, {
    "id": "3",
    "name": "Colorado",
    "values": {
      "weather": {}
    }
  }, {
    "id": "4",
    "name": "New Mexico",
    "values": {
      "weather": {}
    }
  }
]
*/

var newData = JSON.parse(fs.readFileSync('examples/data/new-data-two.json'))
/*
[
  {
    "state_name": "Colorado",
    "avg_temp": 34
  },
  {
    "state_name": "Utah",
    "avg_temp": 72
  },
  {
    "state_name": "New Mexico",
    "avg_temp": 45
  }
]
*/

var joinedData = joiner({
  leftData: data,
  leftDataKey: 'name',
  rightData: newData,
  rightDataKey: 'state_name',
  nestKey: 'values.weather' // If this didn't already exist, it would be created
})

console.log(JSON.stringify(joinedData))

/*
{
  "data": [
    {
      "id": "1",
      "name": "Utah",
      "values": {
        "weather": {
          "avg_temp": 72
        }
      }
    },
    {
      "id": "2",
      "name": "Wyoming",
      "values": {
        "weather": {
          "avg_temp": null
        }
      }
    },
    {
      "id": "3",
      "name": "Colorado",
      "values": {
        "weather": {
          "avg_temp": 34
        }
      }
    },
    {
      "id": "4",
      "name": "New Mexico",
      "values": {
        "weather": {
          "avg_temp": 45
        }
      }
    }
  ],
  "report": {
    "diff": {
      "a": [
        "Colorado",
        "New Mexico",
        "Utah",
        "Wyoming",
      ],
      "b": [
        "Colorado",
        "New Mexico",
        "Utah"
      ],
      "a_and_b": [
        "Colorado",
        "New Mexico",
        "Utah"
      ],
      "a_not_in_b": [
        "Wyoming"
      ],
      "b_not_in_a": []
    },
    "prose": {
      "summary": "3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.",
      "full": "Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."
    }
  }
}
*/
