// mysql版本项目数据插入
const DsAttractionModel = require('../../models/ds_attraction')
const StageInfoModel = require('../../models/stage_info')
const moment = require('moment')

const { handleWaitHourAvg } = require('../../util/etl_tool')
const { removeProperty } = require('../../util/util')

const handleWait = async date => {
  let data, find

  find = {
    local: 'shanghai',
    date
  }

  data = await DsAttractionModel.find(find)

  // 项目列表循环
  for (let item of data) {
    let { id } = item
    // 查询该项目等待时间
    let wait = await StageInfoModel.getWaitByIdDate(id, date)

    let waitList = []
    let fpList = []
    wait.forEach(element => {
      let {
        utime,
        fastPass,
        status,
        signleRider,
        postedWaitMinutes,
        fastPassStartTime
      } = element

      waitList.push([utime, postedWaitMinutes, status])
      if (fastPass) {
        fpList.push([utime, fastPassStartTime])
      }
    })

    let hourList = handleWaitHourAvg(item, waitList)

    let update = {
      waitList,
      fpList,
      hourList
    }
    if (update.fpList.length === 0) delete update.fpList

    find.id = id
    await DsAttractionModel.update(find, update)
  }
  console.log(date, 'ok')
}

const start = async () => {
  let stDate = '2017-04-17'
  for (let d = 0; d <= 400; d++) {
    let date = moment(stDate, 'YYYY-MM-DD')
      .add(d, 'd')
      .format('YYYY-MM-DD')
    await handleWait(date)
  }
}

module.exports = start
