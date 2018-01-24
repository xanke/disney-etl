const ScanWait = require('../lib/mongo').ScanWait

module.exports  =  {
  find: async data => {
    return ScanWait.find(data).exec()
  }
}
