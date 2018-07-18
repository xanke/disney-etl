const _ = require('lodash')
const Logs = require('../../util/logs')
const { DsPark, DsAttraction, DsOperate } = require('../../lib/mongo')

let Name = 'Operate-Count'

const start = async conf => {
  let { date, local, disneyLand } = conf
  let data

  // --- 运营统计 ---

  // 平均最高指数
  let markMaxAvg = await DsPark.aggregate([
    {
      $match: {
        local,
        date: { $gt: '2016-06-16' },
        markMax: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: 'avg',
        avg: {
          $avg: '$markMax'
        }
      }
    }
  ])

  markMaxAvg = parseInt(markMaxAvg[0]['avg'])

  // 平均客流量
  let flowMaxAvg = await DsPark.aggregate([
    {
      $match: {
        local,
        date: { $gt: '2016-06-16' },
        flowMax: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: 'avg',
        avg: {
          $avg: '$flowMax'
        }
      }
    }
  ])

  flowMaxAvg = parseInt(flowMaxAvg[0]['avg'])

  await DsOperate.update(
    { local },
    {
      $set: {
        markMaxAvg,
        flowMaxAvg
      }
    },
    { upsert: true }
  )

  // --- 乐园统计 ---

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

  await DsPark.update(
    {
      local,
      date
    },
    {
      $set: {
        allFlowDay,
        rankFlowDay,
        allMarkDay,
        rankMarkDay
      }
    }
  )

  // --- 项目统计 ---

  const dataAtt = await DsAttraction.find({ local, date })

  for (let i = 0; i < dataAtt.length; i++) {
    const item = dataAtt[i]
    const { id, waitAvg, fpList } = item

    // 计算等候时间排名
    const rankWait = await DsAttraction.count({
      local,
      id,
      waitAvg: { $gt: waitAvg }
    })

    // 计算快速通行证领完时间
    let fpFinish = 0
    if (fpList && fpList.length > 0) {
      fpList.forEach(fitem => {
        const [time, status] = fitem
        if (status !== 'FASTPASS is Not Available') {
          fpFinish = time
        }
      })
    }

    await DsAttraction.update(
      { local, id, date },
      {
        $set: {
          rankWait,
          fpFinish
        }
      }
    )
  }

  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
