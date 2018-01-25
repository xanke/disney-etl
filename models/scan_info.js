const ScanInfo = require('../lib/mongo').ScanInfo




module.exports = {
  find: async data => {
    return ScanInfo.find(data).exec()
  },
  findOne: async data => {
    return ScanInfo.findOne(data).exec()
  },
  update: async (find, data) => {
    return ScanInfo.update(find, data).exec()
  },
  // 提取项目信息
  // getAtts: async (date, local) => {
  //   let data = await ScanInfo.findOne({ date, local }).exec()
  //   data = getAtts(data)
  //   return data
  // }
}
