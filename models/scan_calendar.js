const ScanCalendar = require('../lib/mongo').ScanCalendar

module.exports = {
  findOne: async find => {
    return ScanCalendar.findOne(find, { _id: 0 }).exec()
  }
}
