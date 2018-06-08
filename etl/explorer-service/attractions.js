const ScanSchedulesModel = require('../../models/scan_schedules')
const DsAttractionModel = require('../../models/ds_attraction')
const { lineToObject } = require('../../common/api_tool')
const Logs = require('../../util/logs')

let Name = 'Attraction'

const start = async conf => {
  let { local, date } = conf
  let find = { local, date }

  // 读取项目时间表
  let data = await ScanSchedulesModel.find(find)

  if (data.length === 0) {
    return Logs.msg(Name, 'NO-DATA', conf)
  }

  let attractions = []

  for (let item of data) {
    let activities = item.body.activities
    // 遍历项目
    for (let item of activities) {
      let { id } = item
      id = lineToObject(id)

      if (id.entityType == 'Attraction') {
        let _schedules = []

        if (item.schedule && item.schedule.schedules) {
          let schedules = item.schedule.schedules

          schedules.forEach(arr => {
            if (arr.date === date) {
              _schedules.push(arr)
            }
          })
        }
        // 与当天时间表合并
        Object.assign(item, _schedules[0])

        // 项目状态 type -> status
        if (item.type) {
          item.status = item.type
          delete item.type
        }

        delete item.timeZone
        delete item.schedule

        find.id = id['__id__']
        Object.assign(item, find)

        await DsAttractionModel.update(find, item)
      }
    }
  }
  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
