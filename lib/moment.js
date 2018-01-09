var moment = require('moment')

exports.xToDateX = (time, ms = false) => {
  console.log(time)
  if (ms) time /= 1000
  let date = moment(time * 1000, 'x').format('YYYYMMDD')
  let st = moment(date, 'YYYYMMDD').format('x') / 1000
  et = st + 86400 - 1

  return [st, et]
}
