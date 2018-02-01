const program = require('commander')
const Etl = require('./etl')

const stageAttractions = require('./etl/explorer-service/stage-attractions')
const stageWaitTimes = require('./etl/explorer-service/stage-wait-times')
const attractions = require('./etl/explorer-service/attractions')
const waitCount = require('./etl/explorer-service/wait-count')
const waitTimes = require('./etl/explorer-service/wait-times')
const parkCount = require('./etl/explorer-service/park-count')

program
  .version('0.1.0')
  .option('-f, --fn [value]', 'Add Fn')
  .option('-d, --date [value]', 'Add Date')
  .option('-l, --local [value]', 'Add Local')
  .option('-o, --option [value]', 'Add Option')
  .parse(process.argv)

const start = async () => {
  let { fn, date, local, option } = program
  let promises = []

  if (fn === 'stage-attractions') {
    promises.push(Etl(stageAttractions, date, 'shanghai'))
  }

  if (fn === 'stage-wait-times') {
    promises.push(Etl(stageWaitTimes, date, 'shanghai'))
  }

  if (fn === 'attractions') {
    promises.push(Etl(attractions, date, local))
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

  let results = await Promise.all(promises)
  console.log(results)

  process.exit()
}

start()
