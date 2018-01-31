const DsAttraction = require('../lib/mongo').DsAttraction

module.exports = {
  find: async data => {
    return DsAttraction.find(data).exec()
  },
  findOne: async data => {
    return DsAttraction.findOne(data).exec()
  },
  update: async (find, data) => {
    return DsAttraction.update(find, data, {
      upsert: true
    }).exec()
  }
}
