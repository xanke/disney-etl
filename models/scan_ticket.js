const ScanTicket = require('../lib/mongo').ScanTicket

module.exports = {

  findOne: async find => {
    return ScanTicket.findOne(find).exec()
  }

}
