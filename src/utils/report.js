import intersection from 'lodash/intersection'
import difference from 'lodash/difference'

function init () {
  return {
    aKeys: [],
    bKeys: []
  }
}

function create (reportData) {
  var a = reportData.aKeys.sort()
  var b = reportData.bKeys.sort()

  var report = {
    diff: {},
    prose: {
      summary: '',
      full: ''
    }
  }
  report.diff.a = a
  report.diff.b = b
  report.diff.a_and_b = intersection(a, b)
  report.diff.a_not_in_b = difference(a, b)
  report.diff.b_not_in_a = difference(b, a)

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

export default {
  init, create
}
