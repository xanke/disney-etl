const _ = require('lodash')
const moment = require('moment')
const { getSchedulesByDate, handleWaitHourAvg } = require('../../util/etl_tool')
const { openTimeToX, arrayAvg } = require('../../util/util')
const Logs = require('../../util/logs')
const { DsPark, DsAttraction } = require('../../lib/mongo')

let Name = 'Park-Count'

const start = async conf => {
  let { date, local, disneyLand } = conf
  let data

  // 当天乐园统计
  const dataPark = await DsPark.findOne({
    local,
    date
  })

  const { markMax, flowMax } = dataPark

  // 客流日统计
  const allFlowDay = await DsPark.count({
    local,
    date: { $gt: '2016-06-16' },
    flowMax: { $gt: 0 }
  })

  const rankFlowDay = await DsPark.count({
    local,
    date: { $gt: '2016-06-16' },
    flowMax: { $gt: flowMax }
  })

  // 指数日统计
  const allMarkDay = await DsPark.count({
    local,
    date: { $gt: '2016-06-16' },
    markMax: { $gt: 0 }
  })

  const rankMarkDay = await DsPark.count({
    local,
    date: { $gt: '2016-06-16' },
    markMax: { $gt: markMax }
  })

  // console.log(allFlowDay, rankFlowDay)
  // console.log(allMarkDay, rankMarkDay)

  // 项目统计
  const dataAtt = await DsAttraction.find({ local, date })

  for (let i = 0; i < dataAtt.length; i++) {
    const item = dataAtt[i]
    const { id, waitAvg, status, fpList } = item

    const rankWaitDay = await DsAttraction.count({
      local,
      id,
      waitAvg: { $gt: waitAvg }
    })

    console.log(rankWaitDay)
  }

  // console.log(dataAtt)
}

module.exports = start
