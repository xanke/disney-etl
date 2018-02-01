// mysql版本项目数据插入
const DsAttractionModel = require('../../models/ds_attraction')
const StageInfoModel = require('../../models/stage_info')
const Logs = require('../../util/logs')
const { handleWaitHourAvg } = require('../../util/etl_tool')
const { removeProperty } = require('../../util/util')

let Name = 'Stage-Wait-Times'

const start = async conf => {
  let { date, local } = conf
  let data

  let find = {
    local,
    date
  }
  data = await DsAttractionModel.find(find)

  // 项目列表循环
  for (let item of data) {
    let { id } = item
    // 查询该项目等待时间
    let wait = await StageInfoModel.getWaitByIdDate(id, date)

    let waitList = []
    let fpList = []
    wait.forEach(element => {
      let {
        utime,
        fastPass,
        status,
        signleRider,
        postedWaitMinutes,
        fastPassStartTime
      } = element

      waitList.push([utime * 1000, postedWaitMinutes, status])
      if (fastPass) {
        fpList.push([utime * 1000, fastPassStartTime])
      }
    })

    let hourList = handleWaitHourAvg(item, waitList, conf)

    let update = {
      waitList,
      fpList,
      hourList
    }
    if (update.fpList.length === 0) delete update.fpList

    find.id = id
    await DsAttractionModel.update(find, update)
  }
  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
