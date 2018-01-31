// mysql版本项目数据插入
const DsAttractionModel = require('../../models/ds_attraction')
const StageInfoModel = require('../../models/stage_info')
const moment = require('moment')

const handleInfo = async utime => {
  let date = moment(utime * 1000, 'x').format('YYYY-MM-DD')

  let data = await StageInfoModel.getInfoByUtime(utime)

  for (let item of data) {
    let { name: id, type, start_time, end_time, status } = item

    // 读取游乐项目
    if (type === 2) {
      let update = {
        id,
        local: 'shanghai',
        date,
        status,
        startTime: start_time,
        endTime: end_time
      }

      let find = {
        id,
        date,
        local: 'shanghai'
      }
      await DsAttractionModel.update(find, update)
    }
  }
}

const start = async () => {
  await handleInfo(date)
}

module.exports = start
