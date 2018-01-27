const InfoModel = require('../models/info')
const ScanWaitModel = require('../models/scan_wait')
const ScanInfoModel = require('../models/scan_info')
const moment = require('moment')
const { openTimeToX, arrayAvg } = require('../lib/util')
const { infoEtl, handleWaitArr, formatId } = require('../lib/etl')
const { parkList } = require('../lib/park_arr')

// 原始清洗信息入库
async function handleInfo(db) {
  // 遍历插入初始化数据
  let infoData = scanInfo(infoData)
  for (let item of infoData) {
    let { name, type, date, local } = item
    let find = {
      name,
      type,
      date,
      local
    }
    // 重置统计
    item.wList = []
    await InfoModel.update(find, item)
  }
  // 今日等候数据
  let waitData = await ScanWaitModel.find({ local, date })
  for (let waitItem of waitData) {
    let entries = waitItem.body.entries
    let utime = waitItem.utime

    // 遍历项目插入数据
    for (let item of entries) {
      let [name, type] = formatId(item.id)
      if (type === 'Attraction') {
        let waitArr = handleWaitArr(item.waitTime, utime)
        let find = {
          name,
          local,
          date
        }
        let $push = {
          wList: waitArr
        }
        InfoModel.push(find, $push)
      }
    }
  }
}

// 乐园整体日终统计入库
async function handleParkCountTodb(date, local) {
  let msgArr = []
  let msg = ''

  // 获取所有项目
  let data = await InfoModel.getTaskAtt(local, date)

  let park_name = parkList.filter(item => item.local == local)[0]['park']
  let utc = parkList.filter(item => item.local == local)[0]['utc']

  let find = {
    date,
    local,
    name: park_name
  }
  let disneyPark = await InfoModel.find(find)
  // 获取乐园开放时间
  let waitCubeArr = [] //所有项目矩阵
  let utimeArr = [] //等待时间列表
  let openAtt = 0
  let allAtt = data.length
  data.forEach(item => {
    let { wList, status } = item
    if (status === 'Operating') {
      openAtt++
    }
    if (wList) {
      let attWaitArr = wList.map(_ => _[2])
      utimeArr = wList.map(_ => _[2])
      waitCubeArr.push(attWaitArr)
    }
  })

  if (utimeArr.length === 0) {
    console.log(date, '未统计waitList')
    return `${date} 未统计waitList`
  }

  // 所有项目等待时间合并
  let countList = []
  // 乐园指数数组
  let countArr = []
  for (let key of waitCubeArr[0]) {
    let count = 0
    for (let arr of waitCubeArr) {
      count += arr[key]
    }
    countArr.push(count)

    let utime = utimeArr[key]
    let avg = Math.round((count / openAtt).toFixed(2))
    countList.push([utime, count, avg])
  }

  // 获取最高乐园指数
  let max = Math.max(...countArr)
  let avg = parseFloat(arrayAvg(countArr).toFixed(2))
  let maxList = []

  // 最高乐园指数提取
  maxList = countList.filter(item => {
    return item[1] === max
  })
  // 提取热门时间段
  maxList = maxList.map(item => {
    return item[0]
  })

  let countWait = {
    max,
    avg,
    maxList,
    openAtt,
    allAtt
  }

  // 更新数据
  await InfoModel.update(
    { name: park_name, date, local },
    { countWait, wList: countList }
  )
  console.log('theme-park', date, 'ok')
}


async function handleWaitTodb(date, local) {
  let data
  // 数据检查
  data = await InfoModel.getTaskAtt(local, date)
  if (data.length === 0) {
    let infoData = await ScanInfoModel.getAtts({ local, date })
    await handleInfo(infoData)
  }
  data = await InfoModel.getTaskAtt(local, date)
  if (data.length === 0) throw new Error('无数据')


  for (let item of data) {
    let { name, startTime, endTime, status, wList = [] } = item

    // 没有开放的项目
    if (!startTime || !endTime) {
      continue
    }

    let utc = parkList.filter(item => item.local == local)[0]['utc']

    let startX = openTimeToX(date, startTime, utc)
    let endX = openTimeToX(date, endTime, utc)

    // 提取等待时间为数组
    let attWait = []
    wList.forEach(item => {
      let = [utime, status, postedWaitMinutes] = item
      if (startX <= utime && utime <= endX) {
        attWait.push(postedWaitMinutes)
      }
    })
    let max = attWait.length > 0 ? Math.max(...attWait) : 0
    let avg = attWait.length > 0 ? Math.round(arrayAvg(attWait)) : 0

    // 提取等待时间>20的热门时间段
    let maxList = []
    if (max >= 20) {
      maxList = wList.filter(item => {
        let postedWaitMinutes = item[2]
        return postedWaitMinutes === max
      })
      maxList = maxList.map(item => {
        return item.utime
      })
    }

    let countWait = {
      max,
      avg,
      maxList
    }
    // 更新数据
    await InfoModel.update({ name, date, local }, { countWait })
  }
}

exports.handleWaitTodb = handleWaitTodb
exports.handleParkCountTodb = handleParkCountTodb
