var joiner = require('../src/index.js')

var data = [
  {
    'name': 'AK',
    'id': '1'
  }, {
    'name': 'CA',
    'id': '2'
  }, {
    'name': 'NY',
    'id': '3'
  }, {
    'name': 'LA',
    'id': '4'
  }
]

var newData = [
  {
    'state_name': 'AK',
    'avg_temp': 34
  },
  {
    'state_name': 'CA',
    'avg_temp': 72
  },
  {
    'state_name': 'NY',
    'avg_temp': 45
  }
]

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
      "name": "AK",
      "id": "1",
      "avg_temp": 34
    },
    {
      "name": "CA",
      "id": "2",
      "avg_temp": 72
    },
    {
      "name": "NY",
      "id": "3",
      "avg_temp": 45
    },
    {
      "name": "LA",
      "id": "4",
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
