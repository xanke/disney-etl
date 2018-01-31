const moment = require('moment')
const DsAttractionModel = require('../../models/ds_attraction')
const { handleWaitCount, startTaskDate } = require('../../util/etl_tool')

const handleWait = async date => {
  let data, find
  let local = 'shanghai'
  find = {
    local,
    date
  }

  data = await DsAttractionModel.find(find)
  // 项目列表循环
  for (let item of data) {
    let { id, waitList } = item

    if (waitList) {
      let waitCount = handleWaitCount(item, waitList)

      find.id = id
      let update = waitCount
      await DsAttractionModel.update(find, update)
    }
    // 查询该项目等待时间
  }

  console.log('Wait Count', local, date, 'OK')
}

const start = async date => {
  console.log('Wait-Count START')
  await startTaskDate(date, handleWait)
  console.log('Wait-Count END')
}

module.exports = start
