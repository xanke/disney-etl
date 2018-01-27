const express = require('express')
const router = express.Router()
const InfoModel = require('../models/info')
const ScanWaitModel = require('../models/scan_wait')
const ScanInfoModel = require('../models/scan_info')
const moment = require('moment')
const { openTimeToX, arrayAvg } = require('../lib/util')
const { infoEtl, handleWaitArr, formatId } = require('../lib/etl')
const { parkList } = require('../lib/park_arr')

class ETL {
  constructor(local, reset = false) {
    this.local = local
    let info = parkList.filter(_ => _.local == local)[0]
    let { parkId, utc } = info
    this.parkId = parkId
    this.utc = utc
    this.reset = reset
  }
  // 乐园信息处理
  getAtts(db) {
    let { local, date, body } = db
    let nData = []
    let { activities } = body

    activities.forEach(item => {
      let { id, schedule } = item
      let [name, type] = formatId(id)
      // 只提取游乐项目和娱乐演出
      if (
        type === 'Attraction' ||
        type === 'Entertainment' ||
        type === 'theme-park'
      ) {
        let json = {
          name,
          type,
          date,
          local,
          count: false
        }
        if (schedule) {
          let schedules = schedule.schedules
          let today = schedules[0]
          // 今日开放时间
          if (today) {
            let { startTime, endTime } = today
            json.startTime = startTime
            json.endTime = endTime
            json.status = today.type
          }
          // 今日演出时间表
          if (type === 'Entertainment') {
            let schedules = schedule.schedules
            let dateFormat = moment(date, 'YYYYMMDD').format('YYYY-MM-DD')
            schedules = schedules.filter(item => item.date == dateFormat)
            json.showList = schedules
          }
        }
        nData.push(json)
      }
    })
    return nData
  }

  async attsTodb(task) {
    let [date, local] = task
    let sInfoData = await ScanInfoModel.findOne({ date, local })
    let attsData = this.getAtts(sInfoData)

    // 循环导入info
    for (let item of attsData) {
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
  }
  // 开始任务
  async start(task) {
    for (let item of task) {
      // 检查是否已经处理info数据
      let [date, local] = item
      let data = await InfoModel.findOne({ date, local })
      if (data && !this.reset) {
        console.log(item, '已采集')
      } else {
        await this.attsTodb(item)
        console.log(item, 'ok')
      }
    }
  }
}

module.exports = {
  start: async (st, et, local) => {
    let mode, date
    if (st && et) {
      mode = 'search'
    }
    if (st && !et) {
      mode = 'only'
    }
    if (!et && !et) {
      mode = 'today'
    }

    let dateList = []

    if (mode === 'search') {
      const stX = parseInt(moment(st, 'YYYYMMDD').format('X'))
      const etX = parseInt(moment(et, 'YYYYMMDD').format('X'))
      const dayNum = (etX - stX) / 86400

      for (let d = 0; d <= dayNum; d++) {
        let date = moment(stX + d * 86400, 'X').format('YYYYMMDD')
        dateList.push([date, local])
      }
    } else if (mode === 'only') {
      dateList.push([st, local])
    } else if (mode === 'today') {
      let

      dateList.push([date, local])
    }

    let parkETL = new ETL(local, true)
    await parkETL.start(dateList)
  }
}
