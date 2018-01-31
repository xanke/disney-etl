const ScanSchedulesModel = require('../../models/scan_schedules')
const DsAttractionModel = require('../../models/ds_attraction')

const parkList = require('../../common/park-list')
const { utcDate, lineToObject } = require('../../common/api_tool')

const start = async conf => {
  let { local, utc } = conf
  let date = utcDate(utc)
  let find = { local, date }
  let data = await ScanSchedulesModel.find(find)
  let attractions = []

  for (let item of data) {
    let activities = item.body.activities

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

        Object.assign(item, _schedules[0])

        // 项目状态type -> status
        if (item.type) {
          item.status = item.type
          delete item.type
        }
        delete item.timeZone

        find.id = id['__id__']
        Object.assign(item, find)

        await DsAttractionModel.update(find, item)
      }
    }
  }
  return ['Update Attraction', local, 'ok']
}

const activitiesSchedules = async () => {
  console.log('Schedules START')

  let promises = []

  parkList.forEach(conf => {
    promises.push(start(conf))
  })

  let results = await Promise.all(promises)
  return results
}

module.exports = activitiesSchedules
