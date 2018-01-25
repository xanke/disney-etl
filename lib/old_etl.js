const mysql = require('mysql')
const config = require('config-lite')(__dirname)
const moment = require('moment')

const infoModel = require('../models/info')
const { xToDateX } = require('../lib/moment')

var connection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})

connection.connect()

// 获取mysql数据
function getInfoDb(utime) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM db_disney_info WHERE utime = ${utime}`,
      (err, rows, fields) => {
        if (err) throw err
        resolve(rows)
      }
    )
  })
}

// 处理并数据添加到Mongodb
async function handleInfo(utime) {
  let date = moment(utime * 1000, 'x').format('YYYYMMDD')
  let isAdd = await infoModel.findOne({ date })
  if (isAdd) {
    console.log(utime, '已添加')
    return
  }
  let info = await getInfoDb(utime)

  if (info.length === 0) {
    console.log(utime, '无数据')
    return
  }
  let nInfo = []

  info.forEach(item => {
    let { name, utime, start_time, end_time, type, status } = item
    if (type === 2) {
      type = 'Attraction'
      let json = {
        name,
        date,
        type,
        local: 'shanghai',
        startTime: start_time,
        endTime: end_time,
        status
      }
      nInfo.push(json)
    }
  })
  await infoModel.insert(nInfo)
  console.log(utime, 'ok')
}

async function startInfo() {
  let start = 1492358400 // 20170417

  for (let day = 0; day <= 400; day++) {
    let utime = start + 86400 * day
    await handleInfo(utime)
  }
}

// startInfo()

// 等待时间处理
function getWaitDb(name, utime) {
  return new Promise((resolve, reject) => {
    let [st, et] = xToDateX(utime)
    connection.query(
      `SELECT * FROM db_disney WHERE (utime >= ${st} AND utime <= ${et}) AND name = '${name}'`,
      (err, rows, fields) => {
        if (err) throw err
        resolve(rows)
      }
    )
  })
}

async function handleWait(utime) {
  let date = moment(utime * 1000, 'x').format('YYYYMMDD')
  let att = await infoModel.find({ date })

  for (let item of att) {
    let { name, date } = item
    let arr = await getWaitDb(name, utime)

    if (arr.length === 0) {
      console.log('无数据')
      continue
    }


    let waitList = []

    arr.forEach(item => {
      let {
        utime,
        fastPass,
        status,
        signleRider,
        postedWaitMinutes,
        fastPassStartTime
      } = item

      let json = {
        status,
        signleRider: !!signleRider,
        postedWaitMinutes,
        utime
      }

      if (fastPassStartTime != 0) {
        let available = fastPassStartTime !== 'FASTPASS is Not Available'
        json.fastPass = {
          startTime: fastPassStartTime,
          available
        }
      }
      waitList.push(json)
    })



    await infoModel.update({ name, date, local: 'shanghai' }, { waitList })
  }
  console.log(date, 'ok')
}

async function startWait() {
  let start = 1492358400 // 20170417

  for (let day = 0; day <= 400; day++) {
    let utime = start + 86400 * day
    await handleWait(utime)
  }
}

// startWait()
