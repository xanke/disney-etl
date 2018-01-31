const program = require('commander')

const activitiesSchedules = require('./etl/explorer-service/ancestor-activities-schedules')

const stageAttractions = require('./etl/explorer-service/stage-attractions')
const stageWaitTimes = require('./etl/explorer-service/stage-wait-times')


program
  .version('0.1.0')
  .option('-f, --fn [value]', 'Add Fn')
  .parse(process.argv)

const start = async () => {
  let { fn } = program
  let promises = []

  // promises.push(activitiesSchedules())

  // promises.push(stageAttractions())
  promises.push(stageWaitTimes())

  let results = await Promise.all(promises)
  console.log(results)

  process.exit()
}

start()
