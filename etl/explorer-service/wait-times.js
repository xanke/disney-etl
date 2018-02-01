// 项目排队数据插入
const DsAttractionModel = require('../../models/ds_attraction')
const StageInfoModel = require('../../models/stage_info')
const ScanWaitModel = require('../../models/scan_wait')
const Logs = require('../../util/logs')
const { lineToObject } = require('../../common/api_tool')
const { removeProperty } = require('../../util/util')

let Name = 'Wait-Times'

const start = async conf => {
  let { date, local, option = 'push' } = conf
  let data

  let find = {
    local,
    date
  }
  data = await DsAttractionModel.find(find)
  if (data.length === 0) {
    return Logs.msg(Name, 'NO-DATA', conf)
  }
  let attData = data
  let attWaitList = {}
  let attFpList = {}

  let utime = 0
  attData.forEach(item => {
    attWaitList[item.id] = []
    attFpList[item.id] = []
    if (item.utime) utime = item.utime
  })

  find = {
    date,
    local,
    utime: { $gt: utime }
  }

  data = await ScanWaitModel.find(find)

  let waitData = data

  for (let item of waitData) {
    let entries = item.body.entries
    utime = item.utime

    for (let att of entries) {
      let { id, waitTime } = att
      id = lineToObject(id)
      // 提取游乐项目
      if (id.entityType == 'Attraction') {
        id = id['__id__']

        let { postedWaitMinutes = 0, status } = waitTime
        let waitArr = [utime, postedWaitMinutes, status]
        attWaitList[id].push(waitArr)

        let push = {
          waitList: waitArr
        }

        if (waitTime.fastPass && waitTime.fastPass.available) {
          let { startTime = '' } = waitTime.fastPass
          let fpArr = [utime, startTime]
          attFpList[id].push(fpArr)
          push.fpList = fpArr
        }

        if (option === 'push') {
          let find = {
            date,
            local,
            id
          }
          await DsAttractionModel.pushList(find, push, utime)
        }
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
