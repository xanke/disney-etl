const _ = require('lodash')
const Logs = require('../../util/logs')
const {
  DsPark,
  DsAttraction,
  DsOperate,
  DsCalendar
} = require('../../lib/mongo')

let Name = 'Operate-Count'

// 运营统计
async function countOperate(local) {
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

  // 平均开放项目
  let openAttAvg = await DsPark.aggregate([
    {
      $match: {
        local,
        date: { $gt: '2016-06-16' },
        openAtt: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: 'avg',
        avg: {
          $avg: '$openAtt'
        }
      }
    }
  ])

  openAttAvg = parseInt(openAttAvg[0]['avg'])

  // 平均演出场次
  let showAvg = await DsPark.aggregate([
    {
      $match: {
        local,
        date: { $gt: '2016-06-16' },
        show: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: 'avg',
        avg: {
          $avg: '$show'
        }
      }
    }
  ])

  showAvg = parseInt(showAvg[0]['avg'])

  await DsOperate.update(
    { local },
    {
      $set: {
        markMaxAvg,
        flowMaxAvg,
        openAttAvg,
        showAvg
      }
    },
    { upsert: true }
  )
}

// 乐园统计
async function countPark(local, date) {
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
}

// 项目统计
async function countAtt(local, date) {
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
}

// 演出场次统计
async function countSchedules(local, date) {
  const dataSchedules = await DsCalendar.findOne({ local, date })
  if (!dataSchedules) return

  const { data: schedules } = dataSchedules

  let show = 0
  schedules.forEach(item => {
    const { name, schedule } = item

    schedule.forEach(arr => {
      const { date: _date } = arr
      if (_date === date) {
        show++
      }
    })
  })
  await DsPark.update(
    {
      local,
      date
    },
    {
      $set: {
        show
      }
    }
  )
}

const start = async conf => {
  let { date, local, disneyLand } = conf

  await countOperate(local, date)
  await countPark(local, date)
  await countAtt(local, date)
  await countSchedules(local, date)

  return Logs.msg(Name, 'OK', conf)
}

module.exports = start
