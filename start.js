const program = require('commander')

const activitiesSchedules = require('./etl/explorer-service/ancestor-activities-schedules')

program
  .version('0.1.0')
  .option('-f, --fn [value]', 'Add Fn')
  .parse(process.argv)

const start = async () => {
  let { fn } = program
  let promises = []

  promises.push(activitiesSchedules())

  let results = await Promise.all(promises)
  console.log(results)

  process.exit()
}

start()

// 每日基本信息入库
// 实时排队信息入库
// 每日统计
// 历史数据分析
// -s 20170101 -e 20180101 -l shanghai

