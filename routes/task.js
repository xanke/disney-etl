const express = require('express')
const router = express.Router()
const InfoModel = require('../models/info')
const ScanWaitModel = require('../models/scan_wait')
const ScanInfoModel = require('../models/scan_info')
const moment = require('moment')
const { openTimeToX, arrayAvg } = require('../lib/util')
const { infoEtl, handleWaitArr, formatId } = require('../lib/etl')
const { parkList } = require('../lib/park_arr')

const {
  handleParkCountTodb,
  handleWaitTodb
} = require('../etl/info')

async function taskAtt(date, local) {
  await handleWaitTodb(date, local)
  console.log(date, '项目导入ok')

  await handleParkCountTodb(date, local)
  console.log(date, '乐园整体统计ok')
}

// 乐园项目日终统计
router.get('/att', async (req, res, next) => {
  let { date, local, method } = req.query
  try {
    let data = await ScanInfoModel.getAtts({ date, local })

    res.retData(data)
    // if (method === 'rest') {
    //   let st = 1492358400 // 20170417
    //   for (let day = 0; day <= 300; day++) {
    //     let date = moment((st + 86400 * day) * 1000, 'x').format('YYYYMMDD')
    //     await taskAtt(date, local)
    //   }
    // } else {
    await taskAtt(date, local)
    // }
    res.retData({ date, local, status: 'success' })
  } catch (e) {
    return res.retErr(e.message)
  }
})

module.exports = router
