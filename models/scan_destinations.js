const ScanDestinations = require('../lib/mongo').ScanDestinations

module.exports = {
  getByLocal: async local => {
    let find = {
      local
    }
    return ScanDestinations.findOne(find, { _id: 0 })
      .sort({ date: -1 })
      .exec()
  }
}
