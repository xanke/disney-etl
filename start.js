const program = require('commander')

const Etl = require('./etl')
const attractions = require('./etl/explorer-service/attractions')

const stageAttractions = require('./etl/explorer-service/stage-attractions')
const stageWaitTimes = require('./etl/explorer-service/stage-wait-times')

const waitCount = require('./etl/explorer-service/wait-count')

program
  .version('0.1.0')
  .option('-f, --fn [value]', 'Add Fn')
  .option('-d, --date [value]', 'Add Date')
  .option('-l, --local [value]', 'Add Local')
  .parse(process.argv)

const start = async () => {
  let { fn, date, local } = program
  let promises = []

  // 项目时间表汇合

  // 旧游乐项目时间表获取
  // promises.push(stageAttractions())

  // 旧游乐项目等待时间列表聚合
  // promises.push(stageWaitTimes())

  // promises.push(waitCount(date))

  promises.push(Etl(attractions, date, local))

  let results = await Promise.all(promises)
  console.log(results)

  process.exit()
}

start()
