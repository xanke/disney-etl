const ScanDestinations = require('../lib/mongo').ScanDestinations

module.exports = {
  findOne: async find => {
    return ScanDestinations.findOne(find).exec()
  }
}
