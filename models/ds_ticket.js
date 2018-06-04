const DsTicket = require('../lib/mongo').DsTicket

module.exports = {
  find: async data => {
    return DsTicket.find(data).exec()
  },
  findOne: async data => {
    return DsTicket.findOne(data).exec()
  },
  update: async (find, data) => {
    return DsTicket.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  }
}
