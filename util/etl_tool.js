const moment = require('moment')
const parkList = require('../common/park-list')
const { openTimeToX, arrayAvg } = require('../lib/util')
const { utcDate } = require('../common/api_tool')
exports.dateToRangX = (date, format = 'YYYY-MM-DD', ms = false) => {
  let x = ms ? 'x' : 'X'
  let st = parseInt(moment(date, format).format(x))
  if (ms) {
    et = st + 86400000 - 1
  } else {
    et = st + 86400 - 1
  }
  return [st, et]
}

// 计算项目每小时平均值
exports.handleWaitHourAvg = (item, waitList) => {
  let hourList = []
  let wList = []

  if (waitList.length === 0) {
    return hourList
  }

  // 获取运营时间小时值
  let { startTime, endTime } = item

  let sh = parseInt(moment(startTime, 'hh:mm:ss').format('H'))
  let eh = parseInt(moment(endTime, 'hh:mm:ss').format('H'))

  for (let i = sh; i <= eh; i++) {
    // 样本数量和总和
    let len = 0
    let num = 0
    waitList.forEach(arr => {
      let [utime, postedWaitMinutes = 0, status] = arr
      let h = parseInt(moment(utime * 1000, 'x').format('H'))
      if (h === i) {
        num += postedWaitMinutes
        len++
      }
    })

    // 计算平均值
    let avg = len > 0 ? parseInt(num / len) : 0
    hourList.push([i, avg])
  }

  return hourList
}

// 项目等待时间统计
exports.handleWaitCount = (item, waitList) => {
  // 获取运营时间
  let { startTime, endTime, date } = item
  let st = moment(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm:ss').format('X')
  let et = moment(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm:ss').format('X')

  let waitArr = []

  for (let item of waitList) {
    let [utime, postedWaitMinutes] = item
    if (st < utime && utime < et) {
      waitArr.push(postedWaitMinutes)
    }
  }

  let waitMax = waitArr.length > 0 ? Math.max(...waitArr) : 0
  let waitAvg = parseInt(arrayAvg(waitArr))

  let waitMaxList = []
  if (waitAvg > 20) {
    waitMaxList = waitList.filter(item => {
      return item[1] === waitMax
    })
  }

  let waitCount = {
    waitMax,
    waitAvg,
    waitMaxList
  }

  return waitCount
}
