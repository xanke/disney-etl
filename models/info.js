const Info = require('../lib/mongo').Info

module.exports = {
  insert: async data => {
    return Info.create(data).exec()
  },
  getday: async (local, date, mode) => {
    console.log(date)
    let data = await Info.find(
      { date: date },
      {
        name: 1,
        type: 1,
        startTime: 1,
        endTime: 1,
        status: 1
      }
    ).exec()
    return data
  },
  findOne: async find => {
    let data = await Info.findOne(find).exec()
    return data
  },
  update: async (find, data) => {
    return Info.update(find, { $set: data }).exec()
  }
}
