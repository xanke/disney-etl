const program = require('commander')

const activitiesSchedules = require('./etl/explorer-service/ancestor-activities-schedules')

const stageAttractions = require('./etl/explorer-service/stage-attractions')
const stageWaitTimes = require('./etl/explorer-service/stage-wait-times')

const waitCount = require('./etl/explorer-service/wait-count')

program
  .version('0.1.0')
  .option('-f, --fn [value]', 'Add Fn')
  .option('-m, --mode [value]', 'Add Mode')
  .option('-d, --date [value]', 'Add Date')
  .parse(process.argv)

const start = async () => {
  let { fn, mode, date } = program
  let promises = []

  // promises.push(activitiesSchedules())

  // promises.push(stageAttractions())
  // promises.push(stageWaitTimes())
  promises.push(waitCount(date))

  let results = await Promise.all(promises)
  console.log(results)

  process.exit()
}

start()
