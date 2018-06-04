// 项目排队数据插入
const DsAttractionModel = require('../../models/ds_attraction')
const StageInfoModel = require('../../models/stage_info')
const ScanWaitModel = require('../../models/scan_wait')
const Logs = require('../../util/logs')
const { lineToObject } = require('../../common/api_tool')
const { removeProperty } = require('../../util/util')

let Name = 'Wait-Times'

const start = async conf => {
  let { date, local, option } = conf
  let data, find

  find = {
    local,
    date
  }

  // 获取项目列表
  let attData = await DsAttractionModel.find(find)

  if (attData.length === 0) {
    return Logs.msg(Name, 'NO-DATA', conf)
  }

  let attWaitList = {}
  let attFpList = {}

  // 获取需要开始更新的时间
  let utime = 0
  attData.forEach(item => {
    attWaitList[item.id] = []
    attFpList[item.id] = []
    if (item.utime && option === 'push') utime = item.utime
  })

  find = {
    date,
    local,
    utime: { $gt: utime }
  }

  let waitData = await ScanWaitModel.find(find)

  for (let item of waitData) {
    let { entries } = item.body
    utime = item.utime

    for (let att of entries) {
      let { id, waitTime } = att
      const { entityType, __id__ } = lineToObject(id)

      // 判断是否是项目
      if (entityType !== 'Attraction') continue
      if (!attWaitList[__id__]) continue

      let { postedWaitMinutes = 0, status } = waitTime
      let waitArr = [utime, postedWaitMinutes, status]
      attWaitList[__id__].push(waitArr)

      let push = {
        waitList: waitArr
      }

      // 快速通行证判断
      if (waitTime.fastPass && waitTime.fastPass.available) {
        let { startTime = '' } = waitTime.fastPass
        let fpArr = [utime, startTime]
        attFpList[__id__].push(fpArr)
        push.fpList = fpArr
      }

      // 递增模式
      if (option === 'push') {
        let find = {
          date,
          local,
          id: __id__
        }
        await DsAttractionModel.pushList(find, push, utime)
      }
    }
  }

  // 更新模式
  if (option === 'update') {
    for (let id in attWaitList) {
      let waitList = attWaitList[id]
      let fpList = attFpList[id]

      let find = {
        date,
        local,
        id
      }
      let update = {
        waitList,
        utime
      }

      if (fpList.length > 0) {
        update.fpList = fpList
      }
      await DsAttractionModel.update(find, update)
    }
  }

  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
