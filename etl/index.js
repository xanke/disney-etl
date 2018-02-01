const parkList = require('../common/park-list')
const { utcDate } = require('../common/api_tool')
const moment = require('moment')

const start = async (fn, date, local, option) => {
  if (!date) {
    return await startParkList(fn, '', local, option)
  }

  date = date.split(',')
  if (date.length == 1) {
    // 单天计算
    date = date[0]
    return await startParkList(fn, date, local, option)
  } else if (date.length == 2) {
    let results = []
    //多天计算
    let st = date[0]
    let et = date[1]

    let d = 0
    // 循环至结束
    while (date !== et) {
      date = moment(st, 'YYYY-MM-DD')
        .add(d, 'd')
        .format('YYYY-MM-DD')
      results.push(await startParkList(fn, date, local, option))
      d++
    }
    return results
  }
}

// 乐园列表扫描
const startParkList = async (fn, date, local, option) => {
  if (local) {
    let conf = parkList.filter(_ => _.local === local)[0]
    if (!date) date = utcDate(conf.utc)
    conf.date = date
    conf.option = option

    return await fn(conf)
  } else {
    let promises = []

    for (let conf of parkList) {
      if (!date) date = utcDate(conf.utc)
      conf.date = date
      conf.option = option

      promises.push(fn(conf))
    }

    let results = await Promise.all(promises)
    return results
  }
}

module.exports = start
