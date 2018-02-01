const DsAttractionModel = require('../../models/ds_attraction')
const {
  handleWaitCount,
  startTaskDate,
  handleWaitHourAvg
} = require('../../util/etl_tool')
const Logs = require('../../util/logs')

let Name = 'Wait-Count'

const start = async conf => {
  let { date, local } = conf
  let data

  let find = {
    local,
    date
  }
  data = await DsAttractionModel.find(find)

  if (data.length === 0) {
    return Logs.msg(Name, 'NO-DATA', conf)
  }

  // 项目列表循环
  for (let item of data) {
    let { id, waitList } = item
    if (waitList) {
      let update = handleWaitCount(item, waitList)
      update.waitHour = handleWaitHourAvg(item, waitList)

      find.id = id
      await DsAttractionModel.update(find, update)
    }
  }

  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
