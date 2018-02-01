const _ = require('lodash')
const moment = require('moment')
const WeatherService = require('../../lib/service-weather')
const TravelService = require('../../lib/service-travel')
const ScanSchedulesModel = require('../../models/scan_schedules')
const DsAttractionModel = require('../../models/ds_attraction')
const DsParkModel = require('../../models/ds_park')
const { getSchedulesByDate, handleWaitHourAvg } = require('../../util/etl_tool')
const { openTimeToX, arrayAvg } = require('../../util/util')
const Logs = require('../../util/logs')

let Name = 'Park-Count'

const start = async conf => {
  let { date, local, disneyLand } = conf
  let data

  // 获取乐园信息
  data = await ScanSchedulesModel.getByDisneyLand(disneyLand, date, local)

  // 获取当天开放时间
  let schedules = getSchedulesByDate(data.schedule.schedules, date)
  let { startX, endX } = schedules[0]
  let parkData = schedules[0]

  let find = {
    local,
    date
  }
  data = await DsAttractionModel.find(find)
  if (data.length === 0) {
    return Logs.msg(Name, 'NO-DATA', conf)
  }

  let waitCube = []
  let waitArr = []
  let openAtt = 0
  let allAtt = data.length
  let utimeArr = []

  for (let item of data) {
    let { waitList, status } = item

    if (waitList && waitList.length > 0) {
      if (status === 'Operating') {
        openAtt++
      }
      if (waitList && waitList.length > 0) {
        let waitArr = waitList.map(arr => {
          let [utime, num] = arr
          if (startX < utime && utime < endX) {
            return num
          }
        })

        utimeArr = waitList.map(arr => {
          let [utime, num] = arr
          if (startX < utime && utime < endX) {
            return utime
          }
        })
        waitCube.push(waitArr)
      }
    }
  }

  let markArr = []
  let markList = []
  for (let key of waitCube[0]) {
    let count = 0
    // 循环所有项目
    for (let arr of waitCube) {
      count += arr[key]
    }
    markArr.push(count)

    let utime = utimeArr[key]
    let avg = Math.round(count / openAtt)
    markList.push([utime, count, avg])
  }

  // 获取最高乐园指数
  let markMax = Math.max(...markArr)
  let markAvg = Math.round(arrayAvg(markArr))

  markMaxList = markList.filter(item => {
    return item[1] === markMax
  })

  let markHour = handleWaitHourAvg(parkData, markList)

  let update = {
    id: disneyLand,
    openAtt,
    allAtt,
    markList,
    markMax,
    markAvg,
    markMaxList,
    markHour
  }

  if (local === 'shanghai') {
    // 天气数据合并
    data = await WeatherService.search('shanghai', date, date)
    data = data[0]

    if (data) {
      let weather = {
        wea: data.wea,
        wind: data.wd,
        temMax: data.max,
        temMin: data.min,
        aqi: data.aqi
      }
      Object.assign(update, weather)
    }

    // 客流量数据合并
    data = await TravelService.flowDay('102', date)
    if (data.length > 0) {
      let flowList = []
      let flowArr = []
      for (let item of data) {
        let { num, utime } = item
        flowList.push([utime * 1000, num])
        flowArr.push(num)
      }

      let flowMax = Math.max(...flowArr)
      let flowAvg = Math.round(arrayAvg(flowArr))
      let flowHour = handleWaitHourAvg(parkData, flowList)

      let flow = {
        flowList,
        flowMax,
        flowAvg,
        flowHour
      }

      Object.assign(update, flow)
    }
  }

  Object.assign(update, find)
  await DsParkModel.update(find, update)

  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
