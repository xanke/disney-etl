const moment = require('moment')

exports.countDayNum = (st, et) => {
  let num =
    (moment(et, 'YYYYMMDD').format('x') - moment(st, 'YYYYMMDD').format('x')) /
    86400000
  return num
}

exports.openTimeToX = (date, time, utc = 8) => {
  let x =
    moment(`${date} ${time}`, 'YYYYMMDD h:mm:ss')
      .utc(utc)
      .format('x') / 1000
  return x
}

exports.arrayAvg = arr => {
  let avg = 0
  if (arr.length > 0) {
    avg = arr.reduce((a, b) => a + b, 0) / arr.length
  }
  return avg
}

exports.to = promise => {
  return promise
    .then(data => {
      return [null, data]
    })
    .catch(err => [err])
}
