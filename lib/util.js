const moment = require('moment')

exports.countDayNum = (st, et) => {
  let num =
    (moment(et, 'YYYYMMDD').format('x') - moment(st, 'YYYYMMDD').format('x')) /
    86400000
  return num
}

exports.openTimeToX = (date, time) => {
  let x = moment(`${date} ${time}`, 'YYYYMMDD h:mm:ss').format('x') / 1000
  return x
}

exports.arrayAvg = (arr) => {
  return arr.reduce((a, b) => a + b, 0)  / arr.length
}
