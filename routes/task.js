const express = require('express')
const router = express.Router()
const InfoModel = require('../models/info')
const ScanWaitModel = require('../models/scan_wait')
const ScanInfoModel = require('../models/scan_info')
const moment = require('moment')
const { openTimeToX, arrayAvg } = require('../lib/util')

async function taskAtt(date, local = 'shanghai') {
  let data = await InfoModel.getTaskAtt(local, date)

  for (let item of data) {
    let { name, startTime, endTime, status, waitList = [] } = item

    // 没有开放的项目
    if (!startTime || !endTime) {
      continue
    }

    let startX = openTimeToX(date, startTime)
    let endX = openTimeToX(date, endTime)

    let attWait = []
    waitList.forEach(item => {
      let { postedWaitMinutes, utime } = item
      if (startX <= utime && utime <= endX) {
        attWait.push(postedWaitMinutes)
      }
    })

    let max = Math.max(...attWait)
    let avg = parseFloat(arrayAvg(attWait).toFixed(2))
    let maxList = []

    // 只获取最大时间超过20分钟的项目时间
    if (max >= 20) {
      maxList = waitList.filter(item => {
        return item.postedWaitMinutes === max
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
  console.log(date, 'ok')
}

// 数据重新清洗
router.get('/etl', async (req, res, next) => {
  try {
    let { date, local } = req.query

    console.log(date, local)

    // let scandata = await ScanWaitModel.find({ local, date })

    let info = await ScanInfoModel.findOne({ local, date })
    info = info.body
    let { ancestor, activities } = info

    // 游乐项目提取
    let attData = []
    for (let item of activities) {
      let { id } = item
      id = id.split(';')

      let name = id[0]
      let type = id[1].replace('entityType=', '')

      if (type === 'Attraction') {
        attData.push([name, type])
      }
    }

    // attData

    let wait = await ScanWaitModel.find({ local, date })

    for (let waitItem of wait) {
      let entries = waitItem.body.entries
      let utime = waitItem.utime
      for (let item of entries) {
        let { id } = item
        id = id.split(';')

        let name = id[0]
        let type = id[1].replace('entityType=', '')

        if (name === 'attTronLightcyclePowerRun') {
          let waitTime = item.waitTime
          let { fastPass, status, postedWaitMinutes = 0 } = waitTime

          let waitArr = [utime, status, postedWaitMinutes]

          if (fastPass) {
            let { startTime = '', endTime = '', available } = fastPass
            waitArr.push(startTime, endTime, available)
          }
          console.log(waitArr)
          // console.log([fastPass, status, signleRider ])
        }
      }
    }

    // console.log(attData)
    // console.log(attData.length)

    // console.log(scandata)
    // for (let item of scandata) {
    //   let atts = item.body.entries
    //   let utime = item.utime

    //   for (let aItem of atts) {
    //     let id = aItem.id
    //     // console.log(type)
    //     // InfoModel.update({ date, local, name:id})
    //     // console.log(aItem.id)
    //   }
    // }

    res.retData('countOk')
  } catch (e) {
    return res.retErr(e.message)
  }
})

// 乐园项目日终统计
router.get('/att', async (req, res, next) => {
  let { date, local = 'shanghai', method } = req.query
  // let st = 1492358400 // 20170417
  // for (let day = 0; day <= 300; day++) {
  //   let date = moment((st + 86400 * day) * 1000, 'x').format('YYYYMMDD')
  //   await taskAtt(date, local)
  // }
  await taskAtt(date, local)
  res.retData('countOk')
})

// 乐园整体日终统计
async function taskPark(date, local = 'shanghai') {
  let msgArr = []
  let msg = ''

  let data = await InfoModel.getTaskAtt(local, date)
  let disneyPark = await InfoModel.getTaskPark(local, date)
  let { startTime, endTime } = disneyPark

  let startX = openTimeToX(date, startTime)
  let endX = openTimeToX(date, endTime)

  let waitCubeArr = [] //所有项目矩阵
  let utimeArr = [] //等待时间列表
  let openAtt = 0
  let allAtt = data.length
  data.forEach(item => {
    let { waitList, status } = item
    if (status === 'Operating') {
      openAtt++
    }
    if (waitList) {
      let attWaitArr = waitList.map(_ => _.postedWaitMinutes)
      utimeArr = waitList.map(_ => _.utime)
      waitCubeArr.push(attWaitArr)
    }
  })

  if (utimeArr.length === 0) {
    console.log(date, '未统计waitList')
    return `${date} 未统计waitList`
  }

  // 所有项目等待时间合并
  let countList = []
  let countArr = []
  for (let key of waitCubeArr[0]) {
    let count = 0
    for (let arr of waitCubeArr) {
      count += arr[key]
    }
    countArr.push(count)
    countList.push({
      utime: utimeArr[key],
      count,
      avg: parseFloat((count / openAtt).toFixed(2))
    })
  }

  let max = Math.max(...countArr)
  let avg = parseFloat(arrayAvg(countArr).toFixed(2))
  let maxList = []

  maxList = countList.filter(item => {
    return item.count === max
  })
  maxList = maxList.map(item => {
    return item.utime
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
    { type: 'theme-park', date, local },
    { countWait, waitList: countList }
  )
  console.log('theme-park', date, 'ok')
  return `${date} ok`
}

// 乐园整体日终统计
router.get('/park', async (req, res, next) => {
  let { date, local = 'shanghai', method = '' } = req.query
  let msgArr = []

  if (method === 'rest') {
    let st = 1492358400 // 20170417
    for (let day = 0; day <= 300; day++) {
      let date = moment((st + 86400 * day) * 1000, 'x').format('YYYYMMDD')
      msgArr.push(await taskPark(date, local))
    }
  } else {
    msgArr.push(await taskPark(date, local))
  }

  res.retData(msgArr, 'arr')
})

module.exports = router
