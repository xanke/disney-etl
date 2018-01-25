var InfoModel = require('../models/info')
const moment = require('moment')

function handleWaitArr(arr, utime) {
  let { fastPass, status, postedWaitMinutes = 0 } = arr
  let waitArr = [utime, status, postedWaitMinutes]
  if (fastPass) {
    let { startTime = '', endTime = '', available } = fastPass
    waitArr.push(available, startTime, endTime)
  }
  return waitArr
}
exports.handleWaitArr = handleWaitArr

// id格式化
function formatId(id) {
  id = id.split(';')
  let [name, type] = id
  // let type = name.split(/(?=[A-Z])/)[0]
  // name = name.replace(type, '')
  type = type.replace('entityType=', '')
  return [name, type]
}
exports.formatId = formatId



async function waitEtl(db) {
  let nData = []
  let { local, date, body, utime } = db
  let { entries } = body

  let parkWait = 0
  for (let item of entries) {
    let { id, waitTime } = item
    let [name] = formatId(id)
    waitTime.utime = utime
    let find = { name, date }

    let { postedWaitMinutes = 0 } = waitTime
    parkWait += isNaN(postedWaitMinutes) || postedWaitMinutes

    await InfoModel.updateWait(find, { waitTime })
  }
  // 乐园统计
  waitTime = {
    postedWaitMinutes: parkWait,
    utime
  }

  find = {
    name: 'desShanghaiDisneyland',
    date
  }
  await InfoModel.updateWait(find, { waitTime })
}

exports.waitEtl = waitEtl
