const { formatId } = require('./tool')
const moment =require('moment')

// 乐园信息处理
const getAtts = db => {
  let nData = []
  let { local, date, body } = db
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

module.exports = {
  getAtts
}
