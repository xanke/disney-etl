const Info = require('../lib/mongo').Info

module.exports = {
  insert: async data => {
    return Info.create(data).exec()
  },
  findOne: async find => {
    let data = await Info.findOne(find).exec()
    return data
  },
  updateWait: async (find, data) => {
    return Info.update(find, { $set: data, $push: { waitList: data['waitTime'] } }).exec()
  }
}
