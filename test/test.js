/* global describe, it */
var joiner = require('../src/index.js')
var io = require('indian-ocean')
var chai = require('chai')
var assert = chai.assert
var _ = require('underscore')
var rimraf = require('rimraf')
var exec = require('child_process').exec

var leftDataPath = 'examples/data/left-data.json'
var newDataPath = 'examples/data/new-data.json'
var geoDataPath = 'examples/data/us-states.geojson'
var newGeoDataPath = 'examples/data/new-geo-data.json'

var leftData = io.readDataSync(leftDataPath)
var newData = io.readDataSync(newDataPath)

var geoData = io.readDataSync(geoDataPath)
var newGeoData = io.readDataSync(newGeoDataPath)

var joinedResult = '{"data":[{"id":"1","name":"UT","avg_temp":72},{"id":"2","name":"WY","avg_temp":null},{"id":"3","name":"CO","avg_temp":34},{"id":"4","name":"NM","avg_temp":45}],"report":{"diff":{"a":["UT","WY","CO","NM"],"b":["CO","UT","NM"],"a_and_b":["UT","CO","NM"],"a_not_in_b":["WY"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: UT, CO, NM. A not in B: WY."}}}'
var joinedGeoResultId = '{"data":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-103.00051157559423,36.99999842346288],[-106.40314927871762,36.99999842346288],[-109.04485956299908,36.99999842346288],[-109.04485956299908,40.99944977889005],[-104.05217069691822,40.99944977889005],[-102.05294158231935,40.99892470978733],[-102.03858446120913,36.99999842346288],[-103.00051157559423,36.99999842346288]]]},"properties":{"name":"Colorado","state_name":"Colorado","avg_temp":34},"id":"CO"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-109.04485956299908,36.99999842346288],[-106.40314927871762,36.99999842346288],[-103.00051157559423,36.99999842346288],[-103.0435829389249,35.89420289313209],[-103.06511862059024,32.00186563466003],[-106.66157745870169,32.000290427351864],[-108.21573581888357,31.777661127798083],[-108.21573581888357,31.327151837663315],[-109.04844884327663,31.326626768560594],[-109.04485956299908,36.99999842346288]]]},"properties":{"name":"New Mexico","state_name":"New Mexico","avg_temp":45},"id":"NM"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-111.05126723815307,41.9997064195739],[-111.05126723815307,40.99944977889005],[-109.04485956299908,40.99944977889005],[-109.04485956299908,36.99999842346288],[-114.04113770935749,37.003148838079206],[-114.04113770935749,42.00023148867662],[-111.05126723815307,41.9997064195739]]]},"properties":{"name":"Utah","state_name":"Utah","avg_temp":72},"id":"UT"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-104.05217069691822,40.99944977889005],[-109.04485956299908,40.99944977889005],[-111.05126723815307,40.99944977889005],[-111.05126723815307,41.9997064195739],[-111.05126723815307,44.99995127252268],[-108.82591346606814,44.99995127252268],[-104.05575997719579,44.99995127252268],[-104.05217069691822,40.99944977889005]]]},"properties":{"name":"Wyoming","state_name":null,"avg_temp":null},"id":"WY"}]},"report":{"diff":{"a":["CO","NM","UT","WY"],"b":["CO","UT","NM"],"a_and_b":["CO","NM","UT"],"a_not_in_b":["WY"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: CO, NM, UT. A not in B: WY."}}}'
var joinedGeoResultProp = '{"data":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-103.00051157559423,36.99999842346288],[-106.40314927871762,36.99999842346288],[-109.04485956299908,36.99999842346288],[-109.04485956299908,40.99944977889005],[-104.05217069691822,40.99944977889005],[-102.05294158231935,40.99892470978733],[-102.03858446120913,36.99999842346288],[-103.00051157559423,36.99999842346288]]]},"properties":{"name":"Colorado","state_abbr":"CO","avg_temp":34},"id":"CO"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-109.04485956299908,36.99999842346288],[-106.40314927871762,36.99999842346288],[-103.00051157559423,36.99999842346288],[-103.0435829389249,35.89420289313209],[-103.06511862059024,32.00186563466003],[-106.66157745870169,32.000290427351864],[-108.21573581888357,31.777661127798083],[-108.21573581888357,31.327151837663315],[-109.04844884327663,31.326626768560594],[-109.04485956299908,36.99999842346288]]]},"properties":{"name":"New Mexico","state_abbr":"NM","avg_temp":45},"id":"NM"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-111.05126723815307,41.9997064195739],[-111.05126723815307,40.99944977889005],[-109.04485956299908,40.99944977889005],[-109.04485956299908,36.99999842346288],[-114.04113770935749,37.003148838079206],[-114.04113770935749,42.00023148867662],[-111.05126723815307,41.9997064195739]]]},"properties":{"name":"Utah","state_abbr":"UT","avg_temp":72},"id":"UT"},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-104.05217069691822,40.99944977889005],[-109.04485956299908,40.99944977889005],[-111.05126723815307,40.99944977889005],[-111.05126723815307,41.9997064195739],[-111.05126723815307,44.99995127252268],[-108.82591346606814,44.99995127252268],[-104.05575997719579,44.99995127252268],[-104.05217069691822,40.99944977889005]]]},"properties":{"name":"Wyoming","state_abbr":null,"avg_temp":null},"id":"WY"}]},"report":{"diff":{"a":["Colorado","New Mexico","Utah","Wyoming"],"b":["Colorado","Utah","New Mexico"],"a_and_b":["Colorado","New Mexico","Utah"],"a_not_in_b":["Wyoming"],"b_not_in_a":[]},"prose":{"summary":"3 rows matched in A and B. 1 row in A not in B. All 3 rows in B in A.","full":"Matches in A and B: Colorado, New Mexico, Utah. A not in B: Wyoming."}}}'

describe('js api', function () {
  describe('json', function () {
    var config = {
      leftData: leftData,
      leftDataKey: 'name',
      rightData: newData,
      rightDataKey: 'state_name'
    }
    it('should match expected json', function () {
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedResult))
    })
  })

  describe('geoJson', function () {
    it('should match expected geojson on id', function () {
      var config = {
        leftData: geoData,
        rightData: newGeoData,
        rightDataKey: 'state_abbr',
        geoJson: true
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedGeoResultId))
    })

    it('should match expected geojson on property', function () {
      var config = {
        leftData: geoData,
        leftDataKey: 'name',
        rightData: newGeoData,
        rightDataKey: 'state_name',
        nestKey: 'properties',
        geoJson: true
      }
      var joinedData = joiner(config)
      assert(_.isEqual(JSON.stringify(joinedData), joinedGeoResultProp))
    })
  })
})

describe('cli', function () {
  describe('left()', function () {
    var config = {
      leftDataKey: 'name',
      rightDataKey: 'state_name'
    }
    var cmd = './bin/index.js -a ' + leftDataPath + ' -k ' + config.leftDataKey + ' -b ' + newDataPath + ' -j ' + config.rightDataKey
    it('should match expected json', function (done) {
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
  })

  describe('geoJson()', function () {
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
        leftDataKey: 'name',
        rightDataKey: 'state_name',
        nestKey: 'properties'
      }
      var cmd = './bin/index.js -g -a ' + geoDataPath + ' -k ' + config.leftDataKey + ' -b ' + newGeoDataPath + ' -j ' + config.rightDataKey + ' -n ' + config.nestKey
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
})
