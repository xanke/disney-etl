const ScanCalendar = require('../lib/mongo').ScanCalendar

module.exports = {
  insert: async data => {
    return ScanCalendar.create(data).exec()
  },

  update: async (find, data) => {
    data.utime = Date.now()
    return ScanCalendar.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  }
}
