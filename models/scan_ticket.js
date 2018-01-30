const ScanTicket = require('../lib/mongo').ScanTicket

module.exports = {
  insert: async data => {
    return ScanTicket.create(data).exec()
  },

  updateAvailable: async (find, data) => {
    data.utime = Date.now()
    return ScanTicket.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  },

  pushAvailable: async (find, availableCount) => {
    let data = [Date.now(), availableCount]
    return ScanTicket.update(
      find,
      { $push: { availableList: data } },
      {
        upsert: true
      }
    ).exec()
  }
}
