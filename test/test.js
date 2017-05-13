/* global describe, it */

var joiner = require('../dist/joiner.node.js')
var io = require('indian-ocean')
var chai = require('chai')
var assert = chai.assert
var _ = require('underscore')
var rimraf = require('rimraf')
var exec = require('child_process').exec

// --------------------------------------------
// Our dataset paths
//
var leftDataPath = 'examples/data/left-data.json'
// var leftDataNestedPath = 'examples/data/left-data-nested.json'
var leftDataNestedTwoPath = 'examples/data/left-data-nested-two.json'
var leftDataNestedThreePath = 'examples/data/left-data-nested-three.json'
var leftDataNestedFourPath = 'examples/data/left-data-nested-four.json'
var newDataPath = 'examples/data/new-data.json'
var newDataTwoPath = 'examples/data/new-data-two.json'
var newDataThreePath = 'examples/data/new-data-three.json'
var geoDataPath = 'examples/data/us-states.geojson'
var newGeoDataPath = 'examples/data/new-geo-data.json'
var dbfDataPath = 'examples/data/us-states/us-states.dbf'
var noMatchDataPath = 'examples/data/no-match-data.json'
var perfectDataPath = 'examples/data/perfect-new-data.json'

// --------------------------------------------
// Our loaded data
//
var leftData = io.readDataSync(leftDataPath)
// var leftDataNested = io.readDataSync(leftDataNestedPath)
var leftDataNestedTwo = io.readDataSync(leftDataNestedTwoPath)
var leftDataNestedThree = io.readDataSync(leftDataNestedThreePath)
var leftDataNestedFour = io.readDataSync(leftDataNestedFourPath)
var newData = io.readDataSync(newDataPath)
var newDataTwo = io.readDataSync(newDataTwoPath)
var newDataThree = io.readDataSync(newDataThreePath)
var geoData = io.readDataSync(geoDataPath)
var newGeoData = io.readDataSync(newGeoDataPath)
var noMatchData = io.readDataSync(noMatchDataPath)
var perfectData = io.readDataSync(perfectDataPath)

// --------------------------------------------
// What it should look like
//
var joinedResult = '{"data":[{"id":"1","name":"UT","avg_temp":72},{"id":"2","name":"WY","avg_temp":null},{"id":"3","name":"CO","avg_temp":34},{"id":"4","name":"NM","avg_temp":45}],"report":{"diff":{"a":["CO","NM","UT","WY"],"b":["CO","NM","UT"],"a_and_b":["CO","NM","UT"],"a_not_in_b":["WY"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: CO, NM, UT. A not in B: WY."},"matchStatus":"some"}}'
var joinedResultNested = '{"data":[{"id":"1","name":"Utah","values":{"weather":{"avg_temp":72}}},{"id":"2","name":"Wyoming","values":{"weather":{"avg_temp":null}}},{"id":"3","name":"Colorado","values":{"weather":{"avg_temp":34}}},{"id":"4","name":"New Mexico","values":{"weather":{"avg_temp":45}}}],"report":{"diff":{"a":["Colorado","New Mexico","Utah","Wyoming"],"b":["Colorado","New Mexico","Utah"],"a_and_b":["Colorado","New Mexico","Utah"],"a_not_in_b":["Wyoming"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."},"matchStatus":"some"}}'
var joinedResultNestedKeys = '{"data":[{"id":"1","name":"UT","values":{"name":"Utah"},"type":"state","data":{"avg_temp":72}},{"id":"2","name":"WY","values":{"name":"Wyoming"},"type":null,"data":null},{"id":"3","name":"CO","values":{"name":"Colorado"},"type":"state","data":{"avg_temp":34}},{"id":"4","name":"NM","values":{"name":"New Mexico"},"type":"state","data":{"avg_temp":45}}],"report":{"diff":{"a":["Colorado","New Mexico","Utah","Wyoming"],"b":["Colorado","New Mexico","Utah"],"a_and_b":["Colorado","New Mexico","Utah"],"a_not_in_b":["Wyoming"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."},"matchStatus":"some"}}'
var joinedGeoResultId = '{"data":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-103.00051157559423,36.99999842346288],[-106.40314927871762,36.99999842346288],[-109.04485956299908,36.99999842346288],[-109.04485956299908,40.99944977889005],[-104.05217069691822,40.99944977889005],[-102.05294158231935,40.99892470978733],[-102.03858446120913,36.99999842346288],[-103.00051157559423,36.99999842346288]]]},"properties":{"name":"Colorado","state_name":"Colorado","avg_temp":34},"id":"CO"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-109.04485956299908,36.99999842346288],[-106.40314927871762,36.99999842346288],[-103.00051157559423,36.99999842346288],[-103.0435829389249,35.89420289313209],[-103.06511862059024,32.00186563466003],[-106.66157745870169,32.000290427351864],[-108.21573581888357,31.777661127798083],[-108.21573581888357,31.327151837663315],[-109.04844884327663,31.326626768560594],[-109.04485956299908,36.99999842346288]]]},"properties":{"name":"New Mexico","state_name":"New Mexico","avg_temp":45},"id":"NM"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-111.05126723815307,41.9997064195739],[-111.05126723815307,40.99944977889005],[-109.04485956299908,40.99944977889005],[-109.04485956299908,36.99999842346288],[-114.04113770935749,37.003148838079206],[-114.04113770935749,42.00023148867662],[-111.05126723815307,41.9997064195739]]]},"properties":{"name":"Utah","state_name":"Utah","avg_temp":72},"id":"UT"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-104.05217069691822,40.99944977889005],[-109.04485956299908,40.99944977889005],[-111.05126723815307,40.99944977889005],[-111.05126723815307,41.9997064195739],[-111.05126723815307,44.99995127252268],[-108.82591346606814,44.99995127252268],[-104.05575997719579,44.99995127252268],[-104.05217069691822,40.99944977889005]]]},"properties":{"name":"Wyoming","state_name":null,"avg_temp":null},"id":"WY"}]},"report":{"diff":{"a":["CO","NM","UT","WY"],"b":["CO","NM","UT"],"a_and_b":["CO","NM","UT"],"a_not_in_b":["WY"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: CO, NM, UT. A not in B: WY."},"matchStatus":"some"}}'
var joinedGeoResultIdDifferentOrder = '{"data":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-103.00051157559423,36.99999842346288],[-106.40314927871762,36.99999842346288],[-109.04485956299908,36.99999842346288],[-109.04485956299908,40.99944977889005],[-104.05217069691822,40.99944977889005],[-102.05294158231935,40.99892470978733],[-102.03858446120913,36.99999842346288],[-103.00051157559423,36.99999842346288]]]},"properties":{"name":"Colorado","avg_temp":34,"state_name":"Colorado"},"id":"CO"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-109.04485956299908,36.99999842346288],[-106.40314927871762,36.99999842346288],[-103.00051157559423,36.99999842346288],[-103.0435829389249,35.89420289313209],[-103.06511862059024,32.00186563466003],[-106.66157745870169,32.000290427351864],[-108.21573581888357,31.777661127798083],[-108.21573581888357,31.327151837663315],[-109.04844884327663,31.326626768560594],[-109.04485956299908,36.99999842346288]]]},"properties":{"name":"New Mexico","avg_temp":45,"state_name":"New Mexico"},"id":"NM"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-111.05126723815307,41.9997064195739],[-111.05126723815307,40.99944977889005],[-109.04485956299908,40.99944977889005],[-109.04485956299908,36.99999842346288],[-114.04113770935749,37.003148838079206],[-114.04113770935749,42.00023148867662],[-111.05126723815307,41.9997064195739]]]},"properties":{"name":"Utah","avg_temp":72,"state_name":"Utah"},"id":"UT"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-104.05217069691822,40.99944977889005],[-109.04485956299908,40.99944977889005],[-111.05126723815307,40.99944977889005],[-111.05126723815307,41.9997064195739],[-111.05126723815307,44.99995127252268],[-108.82591346606814,44.99995127252268],[-104.05575997719579,44.99995127252268],[-104.05217069691822,40.99944977889005]]]},"properties":{"name":"Wyoming","state_name":null,"avg_temp":null},"id":"WY"}]},"report":{"diff":{"a":["CO","NM","UT","WY"],"b":["CO","NM","UT"],"a_and_b":["CO","NM","UT"],"a_not_in_b":["WY"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: CO, NM, UT. A not in B: WY."},"matchStatus":"some"}}'
var joinedGeoResultPropDifferentOrder = '{"data":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-103.00051157559423,36.99999842346288],[-106.40314927871762,36.99999842346288],[-109.04485956299908,36.99999842346288],[-109.04485956299908,40.99944977889005],[-104.05217069691822,40.99944977889005],[-102.05294158231935,40.99892470978733],[-102.03858446120913,36.99999842346288],[-103.00051157559423,36.99999842346288]]]},"properties":{"name":"Colorado","avg_temp":34,"state_abbr":"CO"},"id":"CO"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-109.04485956299908,36.99999842346288],[-106.40314927871762,36.99999842346288],[-103.00051157559423,36.99999842346288],[-103.0435829389249,35.89420289313209],[-103.06511862059024,32.00186563466003],[-106.66157745870169,32.000290427351864],[-108.21573581888357,31.777661127798083],[-108.21573581888357,31.327151837663315],[-109.04844884327663,31.326626768560594],[-109.04485956299908,36.99999842346288]]]},"properties":{"name":"New Mexico","avg_temp":45,"state_abbr":"NM"},"id":"NM"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-111.05126723815307,41.9997064195739],[-111.05126723815307,40.99944977889005],[-109.04485956299908,40.99944977889005],[-109.04485956299908,36.99999842346288],[-114.04113770935749,37.003148838079206],[-114.04113770935749,42.00023148867662],[-111.05126723815307,41.9997064195739]]]},"properties":{"name":"Utah","avg_temp":72,"state_abbr":"UT"},"id":"UT"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-104.05217069691822,40.99944977889005],[-109.04485956299908,40.99944977889005],[-111.05126723815307,40.99944977889005],[-111.05126723815307,41.9997064195739],[-111.05126723815307,44.99995127252268],[-108.82591346606814,44.99995127252268],[-104.05575997719579,44.99995127252268],[-104.05217069691822,40.99944977889005]]]},"properties":{"name":"Wyoming","state_abbr":null,"avg_temp":null},"id":"WY"}]},"report":{"diff":{"a":["Colorado","New Mexico","Utah","Wyoming"],"b":["Colorado","New Mexico","Utah"],"a_and_b":["Colorado","New Mexico","Utah"],"a_not_in_b":["Wyoming"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."},"matchStatus":"some"}}'
var joinedGeoResultProp = '{"data":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-103.00051157559423,36.99999842346288],[-106.40314927871762,36.99999842346288],[-109.04485956299908,36.99999842346288],[-109.04485956299908,40.99944977889005],[-104.05217069691822,40.99944977889005],[-102.05294158231935,40.99892470978733],[-102.03858446120913,36.99999842346288],[-103.00051157559423,36.99999842346288]]]},"properties":{"name":"Colorado","state_abbr":"CO","avg_temp":34},"id":"CO"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-109.04485956299908,36.99999842346288],[-106.40314927871762,36.99999842346288],[-103.00051157559423,36.99999842346288],[-103.0435829389249,35.89420289313209],[-103.06511862059024,32.00186563466003],[-106.66157745870169,32.000290427351864],[-108.21573581888357,31.777661127798083],[-108.21573581888357,31.327151837663315],[-109.04844884327663,31.326626768560594],[-109.04485956299908,36.99999842346288]]]},"properties":{"name":"New Mexico","state_abbr":"NM","avg_temp":45},"id":"NM"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-111.05126723815307,41.9997064195739],[-111.05126723815307,40.99944977889005],[-109.04485956299908,40.99944977889005],[-109.04485956299908,36.99999842346288],[-114.04113770935749,37.003148838079206],[-114.04113770935749,42.00023148867662],[-111.05126723815307,41.9997064195739]]]},"properties":{"name":"Utah","state_abbr":"UT","avg_temp":72},"id":"UT"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-104.05217069691822,40.99944977889005],[-109.04485956299908,40.99944977889005],[-111.05126723815307,40.99944977889005],[-111.05126723815307,41.9997064195739],[-111.05126723815307,44.99995127252268],[-108.82591346606814,44.99995127252268],[-104.05575997719579,44.99995127252268],[-104.05217069691822,40.99944977889005]]]},"properties":{"name":"Wyoming","state_abbr":null,"avg_temp":null},"id":"WY"}]},"report":{"diff":{"a":["Colorado","New Mexico","Utah","Wyoming"],"b":["Colorado","New Mexico","Utah"],"a_and_b":["Colorado","New Mexico","Utah"],"a_not_in_b":["Wyoming"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."},"matchStatus":"some"}}'
var joinedGeoResultPropDbf = '[{"name":"Colorado","fid":"CO","avg_temp":34},{"name":"New Mexico","fid":"NM","avg_temp":45},{"name":"Utah","fid":"UT","avg_temp":72},{"name":"Wyoming","fid":"WY","avg_temp":0}]'
var joinedGeoResultPropDbfReport = '{"diff":{"a":["Colorado","New Mexico","Utah","Wyoming"],"b":["Colorado","New Mexico","Utah"],"a_and_b":["Colorado","New Mexico","Utah"],"a_not_in_b":["Wyoming"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."},"matchStatus": "some"}'
var noMatchDataResult = '{"data":[{"id":"1","name":"UT","avg_temp":null},{"id":"2","name":"WY","avg_temp":null},{"id":"3","name":"CO","avg_temp":null},{"id":"4","name":"NM","avg_temp":null}],"report":{"diff":{"a":["CO","NM","UT","WY"],"b":["OH","TX","VT"],"a_and_b":[],"a_not_in_b":["CO","NM","UT","WY"],"b_not_in_a":["OH","TX","VT"]},"prose":{"summary":"No matches. Try choosing different columns to match on.","full":"A not in B: CO, NM, UT, WY. B not in A: OH, TX, VT."},"matchStatus":"none"}}'
var perfectDataResult = '{"data":[{"id":"1","name":"UT","avg_temp":72},{"id":"2","name":"WY","avg_temp":38},{"id":"3","name":"CO","avg_temp":34},{"id":"4","name":"NM","avg_temp":45}],"report":{"diff":{"a":["CO","NM","UT","WY"],"b":["CO","NM","UT","WY"],"a_and_b":["CO","NM","UT","WY"],"a_not_in_b":[],"b_not_in_a":[]},"prose":{"summary":"100%, one-to-one match of 4 rows!","full":"Matches in A and B: CO, NM, UT, WY"},"matchStatus":"perfect"}}'

// --------------------------------------------
// Testing 1, 2, 3
//
describe('js api', function () {
  describe('json', function () {
    it('should match expected json', function () {
      var config = {
        leftData: leftData,
        leftDataKey: 'name',
        rightData: newData,
        rightDataKey: 'state_name'
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedResult))
    })

    it('should match expected json, nesting under key', function () {
      var config = {
        leftData: leftDataNestedTwo,
        leftDataKey: 'name',
        rightData: newDataTwo,
        rightDataKey: 'state_name',
        nestKey: 'values.weather'
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedResultNested))
    })

    it('should match expected json, nesting under key that doesn\'t exist', function () {
      var config = {
        leftData: leftDataNestedThree,
        leftDataKey: 'name',
        rightData: newDataTwo,
        rightDataKey: 'state_name',
        nestKey: 'values.weather'
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedResultNested))
    })

    it('should match expected json, with nested join keys', function () {
      var config = {
        leftData: leftDataNestedFour,
        leftDataKey: 'values.name',
        rightData: newDataThree,
        rightDataKey: 'data.state_name'
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedResultNestedKeys))
    })

    it('should match expected json, with no matches', function () {
      var config = {
        leftData: leftData,
        leftDataKey: 'name',
        rightData: noMatchData,
        rightDataKey: 'state_name'
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), noMatchDataResult))
    })

    it('should match expected json, with perfect matches', function () {
      var config = {
        leftData: leftData,
        leftDataKey: 'name',
        rightData: perfectData,
        rightDataKey: 'state_name'
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), perfectDataResult))
    })
  })

  describe('geoJson', function () {
    it('should match expected geojson, on id', function () {
      var config = {
        leftData: geoData,
        rightData: newGeoData,
        rightDataKey: 'state_abbr',
        geoJson: true
      }
      var joinedData = joiner(config)
      var joinedDataStringified = JSON.stringify(joinedData)
      // Because the sort order of these keys is not guaranteed, test it against two different sort order possibilities
      assert(_.isEqual(joinedDataStringified, joinedGeoResultIdDifferentOrder) || _.isEqual(joinedDataStringified, joinedGeoResultId))
    })

    it('should match expected geojson, on property', function () {
      var config = {
        leftData: geoData,
        leftDataKey: 'properties.name',
        rightData: newGeoData,
        rightDataKey: 'state_name',
        geoJson: true
      }
      var joinedData = joiner(config)
      var joinedDataStringified = JSON.stringify(joinedData)
      // Because the sort order of these keys is not guaranteed, test it against two different sort order possibilities
      assert(_.isEqual(joinedDataStringified, joinedGeoResultPropDifferentOrder) || _.isEqual(joinedDataStringified, joinedGeoResultProp))
    })
  })
})

describe('cli', function () {
  describe('json', function () {
    it('should match expected json', function (done) {
      var config = {
        leftDataKey: 'name',
        rightDataKey: 'state_name'
      }
      var cmd = './bin/index.js -a ' + leftDataPath + ' -k ' + config.leftDataKey + ' -b ' + newDataPath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-left.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(joinedResult)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    it('should match expected json, nesting under key', function (done) {
      var config = {
        leftDataKey: 'name',
        rightDataKey: 'state_name',
        nestKey: 'values.weather'
      }
      var cmd = './bin/index.js -a ' + leftDataNestedTwoPath + ' -k ' + config.leftDataKey + ' -b ' + newDataTwoPath + ' -j ' + config.rightDataKey + ' -n ' + config.nestKey
      var outFile = 'test/tmp-test-left-nested-under-missing.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(joinedResultNested)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    it('should match expected json, with nested join keys', function (done) {
      var config = {
        leftDataKey: 'values.name',
        rightDataKey: 'data.state_name'
      }
      var cmd = './bin/index.js -a ' + leftDataNestedFourPath + ' -k ' + config.leftDataKey + ' -b ' + newDataThreePath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-left-nested-keys.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(joinedResultNestedKeys)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    it('should match expected json, nesting under key that doesn\'t exist', function (done) {
      var config = {
        leftDataKey: 'name',
        rightDataKey: 'state_name',
        nestKey: 'values.weather'
      }
      var cmd = './bin/index.js -a ' + leftDataNestedThreePath + ' -k ' + config.leftDataKey + ' -b ' + newDataTwoPath + ' -j ' + config.rightDataKey + ' -n ' + config.nestKey
      var outFile = 'test/tmp-test-left-nested-under.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(joinedResultNested)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    it('should match expected json, with no matches', function (done) {
      var config = {
        leftDataKey: 'name',
        rightDataKey: 'state_name'
      }
      var cmd = './bin/index.js -a ' + leftDataPath + ' -k ' + config.leftDataKey + ' -b ' + noMatchDataPath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-left-no-match.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(noMatchDataResult)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    it('should match expected json, with perfect matche', function (done) {
      var config = {
        leftDataKey: 'name',
        rightDataKey: 'state_name'
      }
      var cmd = './bin/index.js -a ' + leftDataPath + ' -k ' + config.leftDataKey + ' -b ' + perfectDataPath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-left-perfect-match.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(perfectDataResult)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })
  })

  describe('geoJson', function () {
    it('should match expected geojson on id', function (done) {
      var config = {
        rightDataKey: 'state_abbr'
      }
      var cmd = './bin/index.js --geojson -a ' + geoDataPath + ' -b ' + newGeoDataPath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-geojson-id.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(joinedGeoResultId)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })

    it('should match expected geojson on property', function (done) {
      var config = {
        leftDataKey: 'properties.name',
        rightDataKey: 'state_name'
      }
      var cmd = './bin/index.js -g -a ' + geoDataPath + ' -k ' + config.leftDataKey + ' -b ' + newGeoDataPath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-geojson-prop.json'
      exec(cmd + ' -o ' + outFile, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        var data = io.readDataSync(outFile)
        var report = io.readDataSync(outFile.replace('.json', '.report.json'))
        var parsedResult = JSON.parse(joinedGeoResultProp)
        assert(_.isEqual(parsedResult.data, data))
        assert(_.isEqual(parsedResult.report, report))
        rimraf(outFile.replace('.json', '*'), function (err) {
          assert.equal(err, null)
          done()
        })
      })
    })
  })

  describe('dbf', function () {
    it('should match expected json', function (done) {
      var config = {
        leftDataKey: 'name',
        rightDataKey: 'state_name'
      }
      var cmd = './bin/index.js -a ' + dbfDataPath + ' -k ' + config.leftDataKey + ' -b ' + newDataTwoPath + ' -j ' + config.rightDataKey
      var outFile = 'test/tmp-test-dbf.dbf'
      var outCmd = ' -o ' + outFile
      exec(cmd + outCmd, function (err, stdout, stderr) {
        assert(_.isEqual(err, null))
        io.readDbf(outFile, function (err, data) {
          assert(_.isEqual(err, null))
          var report = io.readDataSync(outFile.replace('.dbf', '.report.json'))
          var parsedResult = JSON.parse(joinedGeoResultPropDbf)
          assert(_.isEqual(parsedResult, data))
          assert(_.isEqual(JSON.parse(joinedGeoResultPropDbfReport), report))
          rimraf(outFile.replace('.dbf', '*'), function (err) {
            assert.equal(err, null)
            done()
          })
        })
      })
    })
  })
})
