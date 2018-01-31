// mysql版本项目数据插入
const DsAttractionModel = require('../../models/ds_attraction')
const StageInfoModel = require('../../models/stage_info')
const Logs = require('../../util/logs')

let Name = 'Stage-Attraction'

const start = async conf => {
  let { date, local } = conf
  let data = await StageInfoModel.getInfoByDate(date)

  for (let item of data) {
    let { name: id, type, start_time, end_time, status } = item

    // 读取游乐项目
    if (type === 2) {
      let update = {
        id,
        local,
        date,
        status,
        startTime: start_time,
        endTime: end_time
      }

      let find = {
        id,
        date,
        local
      }
      await DsAttractionModel.update(find, update)
    }
  }
  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
