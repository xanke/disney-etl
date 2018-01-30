const ScanDestinations = require('../lib/mongo').ScanDestinations

module.exports = {
  insert: async data => {
    return ScanDestinations.create(data).exec()
  },

  update: async (find, data) => {
    data.utime = Date.now()
    return ScanDestinations.update(
      find,
      { $set: data },
      {
        upsert: true
      }
    ).exec()
  }
}
