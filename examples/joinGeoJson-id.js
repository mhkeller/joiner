var fs = require('fs')
var joiner = require('../dist/joiner.node.js')

var geoData = JSON.parse(fs.readFileSync('examples/data/us-states.geojson', 'utf-8'))
var newData = JSON.parse(fs.readFileSync('examples/data/new-geo-data.json', 'utf-8'))
/*
[
  {
    "state_abbr": "CO",
    "state_name": "Colorado",
    "avg_temp": 34
  },
  {
    "state_abbr": "UT",
    "state_name": "Utah",
    "avg_temp": 72
  },
  {
    "state_abbr": "NM",
    "state_name": "New Mexico",
    "avg_temp": 45
  }
]
*/

var joinedData = joiner({
  leftData: geoData,
  rightData: newData,
  rightDataKey: 'state_abbr',
  geoJson: true
})

console.log(JSON.stringify(joinedData))

/*
{
  "data": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -103.00051157559423,
                36.99999842346288
              ],
              [
                -106.40314927871762,
                36.99999842346288
              ],
              [
                -109.04485956299908,
                36.99999842346288
              ],
              [
                -109.04485956299908,
                40.99944977889005
              ],
              [
                -104.05217069691822,
                40.99944977889005
              ],
              [
                -102.05294158231935,
                40.99892470978733
              ],
              [
                -102.03858446120913,
                36.99999842346288
              ],
              [
                -103.00051157559423,
                36.99999842346288
              ]
            ]
          ]
        },
        "properties": {
          "name": "Colorado",
          "state_name": "Colorado",
          "avg_temp": 34
        },
        "id": "CO"
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -109.04485956299908,
                36.99999842346288
              ],
              [
                -106.40314927871762,
                36.99999842346288
              ],
              [
                -103.00051157559423,
                36.99999842346288
              ],
              [
                -103.0435829389249,
                35.89420289313209
              ],
              [
                -103.06511862059024,
                32.00186563466003
              ],
              [
                -106.66157745870169,
                32.000290427351864
              ],
              [
                -108.21573581888357,
                31.777661127798083
              ],
              [
                -108.21573581888357,
                31.327151837663315
              ],
              [
                -109.04844884327663,
                31.326626768560594
              ],
              [
                -109.04485956299908,
                36.99999842346288
              ]
            ]
          ]
        },
        "properties": {
          "name": "New Mexico",
          "state_name": "New Mexico",
          "avg_temp": 45
        },
        "id": "NM"
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -111.05126723815307,
                41.9997064195739
              ],
              [
                -111.05126723815307,
                40.99944977889005
              ],
              [
                -109.04485956299908,
                40.99944977889005
              ],
              [
                -109.04485956299908,
                36.99999842346288
              ],
              [
                -114.04113770935749,
                37.003148838079206
              ],
              [
                -114.04113770935749,
                42.00023148867662
              ],
              [
                -111.05126723815307,
                41.9997064195739
              ]
            ]
          ]
        },
        "properties": {
          "name": "Utah",
          "state_name": "Utah",
          "avg_temp": 72
        },
        "id": "UT"
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -104.05217069691822,
                40.99944977889005
              ],
              [
                -109.04485956299908,
                40.99944977889005
              ],
              [
                -111.05126723815307,
                40.99944977889005
              ],
              [
                -111.05126723815307,
                41.9997064195739
              ],
              [
                -111.05126723815307,
                44.99995127252268
              ],
              [
                -108.82591346606814,
                44.99995127252268
              ],
              [
                -104.05575997719579,
                44.99995127252268
              ],
              [
                -104.05217069691822,
                40.99944977889005
              ]
            ]
          ]
        },
        "properties": {
          "name": "Wyoming",
          "state_name": null,
          "avg_temp": null
        },
        "id": "WY"
      }
    ]
  },
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
        "UT"
      ],
      "a_and_b": [
        "CO",
        "NM",
        "UT"
      ],
      "a_not_in_b": [
        "WY"
      ],
      "b_not_in_a": []
    },
    "prose": {
      "summary": "3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.",
      "full": "Matches in A and B: CO, NM, UT. A not in B: WY."
    },
    "matchStatus": "some"
  }
}
*/
