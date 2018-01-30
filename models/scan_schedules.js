const ScanSchedules = require('../lib/mongo').ScanSchedules

module.exports = {
  insert: async data => {
    return ScanSchedules.create(data).exec()
  },

  update: async (find, data) => {
    data.utime = Date.now()
    return ScanSchedules.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  }
}
