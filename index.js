const program = require('commander')
const Etl = require('./etl')
const schedule = require('node-schedule')

const stageAttractions = require('./etl/stage/stage-attractions')
const stageWaitTimes = require('./etl/stage/stage-wait-times')

const attractions = require('./etl/explorer-service/attractions')
const destinations = require('./etl/explorer-service/destinations')

const waitCount = require('./etl/wait-times/wait-count')
const waitTimes = require('./etl/wait-times/wait-times')
const parkCount = require('./etl/wait-times/park-count')
const ticketCount = require('./etl/tickets/count')

program
  .option('-f, --fn [value]', 'Add Fn')
  .option('-d, --date [value]', 'Add Date')
  .option('-l, --local [value]', 'Add Local')
  .option('-o, --option [value]', 'Add Option')
  .parse(process.argv)

const start = async () => {
  let { fn, date, local, option } = program
  let promises = []

  if (fn === 'all') {
    console.log('Disney-ETL 0.5.0')

    // 实时等候数据
    schedule.scheduleJob('*/2 * * * *', async () => {
      await Etl(waitTimes, null, 'shanghai', 'push')
      await Etl(waitTimes, null, 'hongkong', 'push')
      await Etl(waitTimes, null, 'california', 'push')
      await Etl(waitTimes, null, 'paris', 'push')
      await Etl(waitTimes, null, 'orlando', 'push')
    })

    // 小时数据合并
    schedule.scheduleJob('*/10 * * * *', async () => {
      await Etl(waitCount, null, 'shanghai')
      await Etl(parkCount, null, 'shanghai')

      await Etl(waitCount, null, 'hongkong')
      await Etl(parkCount, null, 'hongkong')

      await Etl(waitCount, null, 'california')
      await Etl(parkCount, null, 'california')

      await Etl(waitCount, null, 'paris')
      await Etl(parkCount, null, 'paris')

      await Etl(waitCount, null, 'orlando')
      await Etl(parkCount, null, 'orlando')
    })

    // 乐园资料
    schedule.scheduleJob('2 */1 * * *', async () => {
      await Etl(attractions, null, 'shanghai')
      await Etl(attractions, null, 'hongkong')
      await Etl(attractions, null, 'california')
      await Etl(attractions, null, 'paris')
      await Etl(attractions, null, 'orlando')

      // CDN 缓存简介
      // await Etl(destinations, null, 'shanghai')
    })
  } else {
    if (fn === 'stage-attractions') {
      promises.push(Etl(stageAttractions, date, 'shanghai'))
    }

    if (fn === 'stage-wait-times') {
      promises.push(Etl(stageWaitTimes, date, 'shanghai'))
    }

    if (fn === 'attractions') {
      promises.push(Etl(attractions, date, local))
    }

    if (fn === 'destinations') {
      promises.push(Etl(destinations, date, local))
    }

    if (fn === 'wait-times') {
      promises.push(Etl(waitTimes, date, local, option))
    }

    if (fn === 'wait-count') {
      promises.push(Etl(waitCount, date, local))
    }

    if (fn === 'park-count') {
      promises.push(Etl(parkCount, date, local))
    }

    if (fn === 'ticket-count') {
      promises.push(Etl(ticketCount, date, local))
    }

    let results = await Promise.all(promises)
    console.log(results)

    process.exit()
  }
}

start()
