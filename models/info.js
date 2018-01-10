const Info = require('../lib/mongo').Info
const moment = require('moment')
const { countDayNum } = require('../lib/util')

module.exports = {
  insert: async data => {
    return Info.create(data).exec()
  },
  // 乐园开放时间
  getOpentime: async (local, method, st, et) => {
    if (method === 'day') {
      let data = await Info.find(
        { date: st },
        {
          name: 1,
          type: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          _id: 0
        }
      ).exec()
      return data
    } else if (method === 'search') {
      let dayNum = countDayNum(st, et)
      if (dayNum > 60) throw new Error('时间差不能大于60天')

      let data = await Info.find(
        { date: { $gte: st, $lte: et } },
        {
          name: 1,
          type: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          date: 1,
          _id: 0
        }
      ).exec()

      let nData = []

      //生成项目列表
      let attList = new Set()
      data.forEach(item => {
        attList.add(item.name)
      })

      attList.forEach(itemName => {
        let att = data.filter(item => {
          return item.name === itemName
        })
        let openTimeList = []
        att.forEach(item => {
          let { startTime, endTime, status, date } = item
          openTimeList.push({
            startTime,
            endTime,
            status,
            date
          })
        })
        let { name } = att[0]
        nData.push({
          name,
          openTimeList
        })
      })
      return nData
    }
    return []
  },
  // 项目等待时间
  getAttWait: async (local, method, indicators, st, et) => {
    if (method === 'day') {
      let data = await Info.find(
        {
          date: st,
          name: indicators
        },
        {
          name: 1,
          type: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          waitList: 1,
          _id: 0
        }
      ).exec()
      return data
    }
    return []
  },

  findOne: async find => {
    let data = await Info.findOne(find).exec()
    return data
  },
  update: async (find, data) => {
    return Info.update(find, { $set: data }).exec()
  }
}
