const express = require('express')
const router = express.Router()
const infoModel = require('../models/info')
const moment = require('moment')
const { openTimeToX, arrayAvg } = require('../lib/util')

async function taskAtt(date, local = 'shanghai') {
  let data = await infoModel.getTaskAtt(local, date)

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
    await infoModel.update({ name, date, local }, { countWait })
  }
  console.log(date, 'ok')
}

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

module.exports = router
