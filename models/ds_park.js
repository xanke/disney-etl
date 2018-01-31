const DsPark = require('../lib/mongo').DsPark

module.exports = {
  find: async data => {
    return DsPark.find(data).exec()
  },
  findOne: async data => {
    return DsPark.findOne(data).exec()
  },
  update: async (find, data) => {
    return DsPark.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  }
}
