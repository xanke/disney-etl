const moment = require('moment')
const parkList = require('../common/park-list')
const { openTimeToX, arrayAvg } = require('../util/util')
const { utcDate } = require('../common/api_tool')
exports.dateToRangX = (date, format = 'YYYY-MM-DD') => {
  let st = parseInt(moment(date, format).format('X'))
  et = st + 86400 - 1
  return [st, et]
}

exports.handleWaitArr = (arr, utime) => {
  let { fastPass, status, postedWaitMinutes = 0 } = arr
  let waitArr = [utime, status, postedWaitMinutes]
  if (fastPass) {
    let { startTime = '', endTime = '', available } = fastPass
    waitArr.push(available, startTime, endTime)
  }
  return waitArr
}

exports.getSchedulesByDate = (schedules, date, conf) => {
  let { utc } = conf
  let _schedules = []

  schedules.forEach(arr => {
    if (arr.date === date) {
      let { startTime, endTime } = arr
      arr.startX = moment(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm:ss')
        .utcOffset(utc)
        .format('x')
      arr.endX = moment(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm:ss')
        .utcOffset(utc)
        .format('x')
      _schedules.push(arr)
    }
  })

  return _schedules
}

// 计算项目每小时平均值
exports.handleWaitHourAvg = (item, waitList, conf) => {
  let { utc } = conf
  let hourList = []
  let wList = []

  if (waitList.length === 0) {
    return hourList
  }

  // 获取运营时间小时值
  let { startTime, endTime } = item

  let sh = parseInt(
    moment(startTime, 'hh:mm:ss').format('H')
  )
  let eh = parseInt(
    moment(endTime, 'hh:mm:ss').format('H')
  )

  console.log(sh, eh)

  for (let i = sh; i <= eh; i++) {
    // 样本数量和总和
    let len = 0
    let num = 0
    waitList.forEach(arr => {
      let [utime, postedWaitMinutes = 0] = arr
      let h = parseInt(moment(utime, 'x').utcOffset(utc).format('H'))
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

function xToXUTC(time, utc) {
  let m = moment(time, 'x').format('YYYY-MM-DD hh:mm:ss')
  m = moment(m, 'YYYY-MM-DD hh:mm:ss').utcOffset(utc).format('YYYY-MM-DD hh:mm:ss')
  m = moment(m, 'YYYY-MM-DD hh:mm:ss').format('x')
  return m
}

// 项目等待时间统计
exports.handleWaitCount = (item, waitList, conf) => {
  let { utc } = conf
  // 获取运营时间
  let { startTime, endTime, date } = item
  let st = moment(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm:ss').format('x')
  let et = moment(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm:ss').format('x')

  let waitArr = []

  for (let item of waitList) {
    let [utime, postedWaitMinutes] = item

    utime = xToXUTC(utime, utc) // moment(utime, 'x').utcOffset(utc).format('x')
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
