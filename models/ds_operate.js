const DsOperate = require('../lib/mongo').DsOperate

module.exports = {
  find: async data => {
    return DsOperate.find(data).exec()
  },
  findOne: async data => {
    return DsOperate.findOne(data).exec()
  },
  update: async (find, data) => {
    return DsOperate.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  }
}
