const moment = require('moment')

handleWaitArr = (arr, utime) => {
  let { fastPass, status, postedWaitMinutes = 0 } = arr
  let waitArr = [utime, status, postedWaitMinutes]
  if (fastPass) {
    let { startTime = '', endTime = '', available } = fastPass
    waitArr.push(available, startTime, endTime)
  }
  return waitArr
}

// id格式化
formatId = (id) => {
  id = id.split(';')
  let [name, type] = id
  type = type.replace('entityType=', '')
  return [name, type]
}


exports.handleWaitArr = handleWaitArr
exports.formatId = formatId
