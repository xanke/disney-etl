const ScanSchedules = require('../lib/mongo').ScanSchedules

module.exports = {
  find: async find => {
    return ScanSchedules.find(find).exec()
  }
}
