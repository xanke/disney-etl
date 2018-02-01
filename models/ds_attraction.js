const DsAttraction = require('../lib/mongo').DsAttraction
const moment = require('moment')

module.exports = {
  find: async data => {
    return DsAttraction.find(data).exec()
  },
  findOne: async data => {
    return DsAttraction.findOne(data).exec()
  },
  update: async (find, data) => {
    return DsAttraction.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  },
  pushList: async (find, data, utime) => {
    return DsAttraction.update(
      find,
      { $set: { utime }, $push: data },
      {
        upsert: true
      }
    ).exec()
  },
  getParkSchedules: async (date, conf) => {
    let { utc } = conf
    let find = {
      date,
      id: 'desShanghaiDisneyland'
    }

    let data = await DsAttraction.findOne(find).exec()
    let { startTime, endTime } = data
    data.startX = moment(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm:ss')
      .utcOffset(utc)
      .format('x')
    data.endX = moment(`${date} ${endTime}`, 'YYYY-MM-DD hh:mm:ss')
      .utcOffset(utc)
      .format('x')
    return data
  }
}
