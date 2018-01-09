var moment = require('moment')

exports.xToDateX = (time, ms = false) => {
  if (ms) time /= 1000
  moment(time * 1000, 'x').format('YYYYMMDD')
  let st = moment('20180109', 'YYYYMMDD').format('x') / 1000
  et = st + 86400 - 1

  return [st, et]
}
