const Info = require('../lib/mongo').Info
const moment = require('moment')
const { countDayNum } = require('../lib/util')
const { timeSim } = require('../lib/moment')

module.exports = {
  insert: async data => {
    return Info.create(data).exec()
  },
  // 乐园开放时间
  getOpenTime: async (local, method, st, et) => {
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
      let data = await Info.findOne(
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
    } else if (method === 'search') {
      let data = await Info.find(
        {
          date: { $gte: st, $lte: et },
          name: indicators
        },
        {
          // name: 1,
          // type: 1,
          date: 1,
          countWait: 1,
          _id: 0
        }
      ).exec()

      return data
    } else if (method === 'three') {
      let yd = moment(st, 'YYYYMMDD')
        .subtract(1, 'days')
        .format('YYYYMMDD')
      let lk = moment(st, 'YYYYMMDD')
        .subtract(7, 'days')
        .format('YYYYMMDD')

      let data = await Info.find(
        {
          date: { $in: [st, yd, lk] },
          name: indicators
        },
        {
          name: 1,
          type: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          waitList: 1,
          date: 1,
          _id: 0
        }
      )
        .sort({ date: -1 })
        .exec()

      data.forEach(item => {
        let { waitList } = item
        let wList = []

        let { startTime, endTime } = item

        let sh = parseInt(moment(startTime, 'hh:mm:ss').format('H'))
        let eh = parseInt(moment(endTime, 'hh:mm:ss').format('H'))

        for (let i = sh; i <= eh; i++) {
          let len = 0
          let num = 0
          waitList.forEach(arr => {
            let { utime, postedWaitMinutes = 0, status } = arr
            let h = parseInt(moment(utime * 1000, 'x').format('H'))
            if (h === i) {
              num += postedWaitMinutes
              len++
            }
          })

          let avg = parseInt(num / len)
          wList.push([i, avg])
        }

        item.waitList = wList
        // 日期详情
        // waitList.forEach(arr => {
        //   let { utime, postedWaitMinutes = 0, status } = arr
        //   let _time = [utime, postedWaitMinutes, status]

        //   if (arr.fastPass && arr.fastPass.startTime) {
        //     _time.push(arr.fastPass.startTime)
        //   }
        //   wList.push(_time)
        // })
        // item.waitList = wList
      })

      return data
    }
    return []
  },
  // 乐园整体情况
  getParkWait: async (local, method, indicators, st, et) => {
    if (method === 'now') {
      let data = await Info.find(
        {
          date: st
        },
        {
          name: 1,
          type: 1,
          startTime: 1,
          endTime: 1,
          status: 1,
          waitTime: 1,
          schedules: 1,
          _id: 0
        }
      ).exec()

      data.forEach(item => {
        // item.startTime = timeSim(item.startTime)
        // item.endTime = timeSim(item.endTime)
        // if (
        //   item.waitTime &&
        //   item.waitTime.fastPass &&
        //   item.waitTime.fastPass.startTime
        // ) {
        //   let { startTime, endTime } = item.waitTime.fastPass
        //   item.waitTime.fastPass.startTime = timeSim(
        //     item.waitTime.fastPass.startTime
        //   )
        //   item.waitTime.fastPass.endTime = timeSim(
        //     item.waitTime.fastPass.endTime
        //   )
        // }

        // 提取今日演出时间
        if (item.type === 'Entertainment' && item.schedules) {
          let schedules = item.schedules
          let date = moment(st, 'YYYYMMDD').format('YYYY-MM-DD')
          schedules = schedules.filter(item => item.date == date)
          item.showList = schedules
        }
        delete item.schedules
      })

      return data
    }
    return []
  },
  getTaskAtt: async (local, date) => {
    let data = await Info.find(
      {
        local,
        date,
        type: 'Attraction'
      },
      {
        _id: 0
      }
    ).exec()
    return data
  },

  find: async find => {
    let data = await Info.find(find).exec()
    return data
  },
  findOne: async find => {
    let data = await Info.findOne(find).exec()
    return data
  },
  update: async (find, data) => {
    return Info.update(find, { $set: data }, {
      upsert: true
    }).exec()
  },

  push: async (find, data) => {
    return Info.update(find, { $push: data }).exec()
  }
}
