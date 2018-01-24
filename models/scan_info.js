const ScanInfo = require('../lib/mongo').ScanInfo

module.exports  =  {
  find: async data => {
    return ScanInfo.find(data).exec()
  },
  findOne: async data => {
    return ScanInfo.findOne(data).exec()
  }
}
