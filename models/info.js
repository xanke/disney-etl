const Info = require('../lib/mongo').Info

module.exports = {
  insert: async data => {
    return Info.create(data).exec()
  },
  find: async find => {
    let data = await Info.find(find).exec()
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
