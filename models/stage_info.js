const Db = require('../lib/mysql')
const { dateToRangX } = require('../util/etl_tool')
const moment = require('moment')

module.exports = {
  // 根据日期获取乐园信息
  getInfoByDate: async date => {
    let utime = moment(date, 'YYYY-MM-DD').format('X')
    return new Promise((resolve, reject) => {
      Db.query(
        `SELECT * FROM db_disney_info WHERE utime = ${utime}`,
        (err, rows, fields) => {
          if (err) reject(err)
          resolve(rows)
        }
      )
    })
  },
  // 根据ID日期获取排队信息
  getWaitByIdDate: async (id, date) => {
    return new Promise((resolve, reject) => {
      let [st, et] = dateToRangX(date)
      Db.query(
        `SELECT * FROM db_disney WHERE (utime >= ${st} AND utime <= ${et}) AND name = '${id}'`,
        (err, rows, fields) => {
          if (err) reject(err)
          resolve(rows)
        }
      )
    })
  }
}
