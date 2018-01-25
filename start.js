const ParkTask = require('./controller/park')

var program = require('commander')


program
  .version('0.1.0')
  .option('-s, --st [value]', 'Add start date')
  .option('-e, --et [value]', 'Add end date')
  .option('-l, --local [value]', 'Add Local')
  .parse(process.argv)

let { st, et, local } = program

const start = async (st, et, local) => {
  console.log(st, et)

  let data = await ParkTask.start(st, et, local)
  console.log('ok')
}


// 每日基本信息入库
// 实时排队信息入库
// 每日统计
// 历史数据分析

// -s 20170101 -e 20180101 -l shanghai


start(st, et, local)
