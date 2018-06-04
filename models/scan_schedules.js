const ScanSchedules = require('../lib/mongo').ScanSchedules
const { lineToObject } = require('../common/api_tool')

module.exports = {
  find: async find => {
    return ScanSchedules.find(find).exec()
  },

  // 获取乐园开放时间
  getByDisneyLand: async (name, date, local) => {
    let find = {
      date,
      local,
      filters: { $in: ['theme-park'] }
    }
    let data = await ScanSchedules.findOne(find).exec()

    let activities = data.body.activities
    for (let item of activities) {
      let { id } = item

      const { __id__, entityType } = lineToObject(id)
      if (__id__ === name) {
        data = item
      }
    }

    return data
  }
}
