var _ = require('underscore')
var cloneDeep = require('lodash.clonedeep')

var geojson
var reportData = {
  a_keys: [],
  b_keys: []
}

function resetJoinrReport () {
  reportData = {
    a_keys: [],
    b_keys: []
  }
}

function addNulls (data, nullKeyObj, path) {
  data.forEach(function (datum) {
    if (!path && geojson) path = 'properties'
    if (path) datum = datum[path]
    // Create copies of our objects so they don't get overwritten
    var nullKeyObjPersist = _.extend({}, nullKeyObj)
    var datumPersist = _.extend({}, datum)
    // You could extend `nullKeyObjPersist` with `datum` but that would reverse the order of your keys
    // And always put your keys that have nulls (which are probably the least important keys) first.
    // This way will overwrite everything with nulls, then rewrite keys that have values.
    _.extend(datum, nullKeyObjPersist, datumPersist)
  })
  return data
}

function addToNullMatch (keyMap, keys) {
  keys.forEach(function (key) {
    if (!keyMap.null_match[key]) {
      keyMap.null_match[key] = null
    }
  })
}

function indexRightDataOnKey (rightData, rightKeyColumn) {
  var keyMap = {
    null_match: {}
  }
  rightData.forEach(function (datum) {
    // Copy this value because we're going to be deleting the match column
    // And we don't want that column to be deleted the next time we join, if we want to join without reloading data
    // This will delete the copy, but keep the original data next time the function is run
    var datumPersist = _.extend({}, datum)
    var rightKeyValue = datumPersist[rightKeyColumn]
    reportData.b_keys.push(rightKeyValue)
    if (!keyMap[rightKeyValue]) {
      // Get rid of the original name key since that will just be a duplicate
      delete datumPersist[rightKeyColumn]
      keyMap[rightKeyValue] = datumPersist
      // Log the new keys that we've encountered for a comprehensive list at the end
      addToNullMatch(keyMap, Object.keys(datumPersist))
    } else {
      console.error('Duplicate entry for "' + rightKeyValue + '"')
    }
  })
  return keyMap
}

function joinOnMatch (leftData, leftKeyColumn, keyMap, nestKey) {
  if (geojson) {
    leftData = leftData.features
  }

  leftData.forEach(function (datum) {
    if (nestKey) {
      datum = datum[nestKey]
    }
    var leftKeyValue = datum[leftKeyColumn]
    var match = keyMap[leftKeyValue]
    reportData.a_keys.push(leftKeyValue)
    if (match) {
      if (!nestKey && geojson) {
        _.extend(datum.properties || {}, match)
      } else {
        _.extend(datum, match)
      }
    }
  })
  return leftData
}

function createJoinReport () {
  var a = reportData.a_keys
  var b = reportData.b_keys

  var report = { diff: {}, prose: {} }
  report.diff.a = a
  report.diff.b = b
  report.diff.a_and_b = _.intersection(a, b)
  report.diff.a_not_in_b = _.difference(a, b)
  report.diff.b_not_in_a = _.difference(b, a)

  report.prose.summary = 'No matches. Try choosing different columns to match on.'

  // If it matched some things...
  if (report.diff.a_and_b.length !== 0) {
    // But it wasn't a perfect match...
    if (report.diff.a_not_in_b.length !== 0 || report.diff.b_not_in_a.length !== 0) {
      report.prose.summary = printRows(report.diff.a_and_b.length) + ' matched in A and B. '
      report.prose.full = 'Matches in A and B: ' + report.diff.a_and_b.join(', ') + '. '

      if (report.diff.a_not_in_b.length === 0) {
        report.prose.summary += 'All ' + printRows(report.diff.a.length) + ' in A find a match. '
      } else {
        report.prose.summary += printRows(report.diff.a_not_in_b.length) + ' in A not in B. '
        report.prose.full += 'A not in B: ' + report.diff.a_not_in_b.join(', ') + '. '
      }

      if (report.diff.b_not_in_a.length === 0) {
        report.prose.summary += 'All ' + printRows(report.diff.b.length) + ' in B in A. '
      } else {
        report.prose.summary += printRows(report.diff.b_not_in_a.length) + ' in B not in A. '
        report.prose.full += 'B not in A: ' + report.diff.b_not_in_a.join(', ') + '. '
      }
    } else {
      report.prose.summary = '100%, one-to-one match of ' + report.diff.a.length + ' rows!'
    }
    report.prose.summary = report.prose.summary.trim()
    report.prose.full = report.prose.full.trim()
  }

  return report
}

function printRows (length) {
  return length + ' row' + (length > 1 ? 's' : '')
}

function joinDataLeft (config) {
  var leftData = cloneDeep(config.leftData)
  var leftDataKey = config.leftDataKey
  var rightData = cloneDeep(config.rightData)
  var rightDataKey = config.rightDataKey
  var nestKey = config.nestKey

  resetJoinrReport()

  var keyMap = indexRightDataOnKey(rightData, rightDataKey)
  var joinedData = joinOnMatch(leftData, leftDataKey, keyMap, nestKey)
  var joinedDataWithNull = addNulls(joinedData, keyMap.null_match, nestKey)

  var report = createJoinReport()
  // If it's geojson, nest the collection back under a `FeatureCollection`
  if (geojson) joinedDataWithNull = { type: 'FeatureCollection', features: joinedDataWithNull }
  return {data: joinedDataWithNull, report: report}
}

function joinGeoJson (config) {
  geojson = true
  config.leftDataKey = config.leftDataKey || 'id'
  return joinDataLeft(config)
}

module.exports = {
  left: joinDataLeft,
  geoJson: joinGeoJson
}
