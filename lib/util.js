const moment = require('moment')

exports.countDayNum = (st, et) => {
  let num =
    (moment(et, 'YYYYMMDD').format('x') - moment(st, 'YYYYMMDD').format('x')) /
    86400000
  return num
}
