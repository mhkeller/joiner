var _ = require('underscore')
var cloneDeep = require('lodash.clonedeep')
var get = require('lodash.get')
var set = require('lodash.set')
var unset = require('lodash.unset')

var joinReport = require('./report.js')

function addNulls (data, nullKeyObj, nestKey) {
  data.forEach(function (datum) {
    var nestedDestination
    if (nestKey) {
      // Set the nested destination to an object if it isn't already or doesn't exist
      nestedDestination = get(datum, nestKey)
      if (!_.isObject(nestedDestination) || _.isArray(nestedDestination) || _.isFunction(nestedDestination)) {
        set(datum, nestKey, {})
      }
      datum = get(datum, nestKey)
    }
    // Create copies of this so they don't get overwritten or messed up by the extend
    var datumPersist = cloneDeep(datum)
    // You could extend `nullKeyObjPersist` with `datum` but that would reverse the order of your keys
    // And always put your keys that have nulls (which are probably the least important keys) first.
    // This way will overwrite everything with nulls, then rewrite keys that have values.
    _.extend(datum, nullKeyObj, datumPersist)
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

function indexRightDataOnKey (rightData, rightKeyColumn, reportData) {
  var keyMap = {
    null_match: {}
  }
  rightData.forEach(function (datum) {
    // Copy this value because we're going to be deleting the match column
    // And we don't want that column to be deleted the next time we join, if we want to join without reloading data
    // This will delete the copy, but keep the original data next time the function is run
    var datumPersist = cloneDeep(datum)
    var rightKeyValue = get(datumPersist, rightKeyColumn)
    reportData.bKeys.push(rightKeyValue)
    if (!keyMap[rightKeyValue]) {
      // Get rid of the original name key since that will just be a duplicate
      unset(datumPersist, rightKeyColumn)
      set(keyMap, rightKeyValue, datumPersist)
      // Log the new keys that we've encountered for a comprehensive list at the end
      addToNullMatch(keyMap, Object.keys(datumPersist))
    } else {
      console.error('[Joiner] Duplicate entry for "' + rightKeyValue + '"')
    }
  })
  return keyMap
}

function joinOnMatch (leftData, leftKeyColumn, keyMap, nestKey, geoJson, reportData) {
  if (geoJson) {
    leftData = leftData.features
  }

  leftData.forEach(function (datum) {
    var leftKeyValue = get(datum, leftKeyColumn)
    var match = keyMap[leftKeyValue]
    reportData.aKeys.push(leftKeyValue)
    if (match) {
      if (typeof nestKey === 'string' && nestKey !== '') {
        set(datum, nestKey, _.extend(get(datum, nestKey) || {}, match))
      } else {
        _.extend(datum, match)
      }
    }
  })
  return leftData
}

function joinDataLeft (config) {
  var requiredKeys = ['leftData', 'rightData', 'rightDataKey']
  requiredKeys.forEach(function (k) {
    if (!config[k]) {
      throw new Error('[joiner] `' + k + '` is required')
    }
  })

  var leftData = cloneDeep(config.leftData)
  var leftDataKey = config.leftDataKey
  var rightData = cloneDeep(config.rightData)
  var rightDataKey = config.rightDataKey
  var nestKey = config.nestKey
  var geoJson = config.geoJson

  if (geoJson === true) {
    leftDataKey = config.leftDataKey || 'id'
    nestKey = config.nestKey || 'properties'
  }

  var reportData = joinReport.init()

  var keyMap = indexRightDataOnKey(rightData, rightDataKey, reportData)
  var joinedData = joinOnMatch(leftData, leftDataKey, keyMap, nestKey, geoJson, reportData)
  var joinedDataWithNull = addNulls(joinedData, keyMap.null_match, nestKey)

  var report = joinReport.create(reportData)
  // If it's geoJson, nest the collection back under a `FeatureCollection`
  if (geoJson) {
    joinedDataWithNull = {
      type: 'FeatureCollection',
      features: joinedDataWithNull
    }
  }
  return {data: joinedDataWithNull, report: report}
}

module.exports = joinDataLeft
