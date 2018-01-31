const mysql = require('mysql')
const config = require('config-lite')(__dirname)

var db = {}
var pool = mysql.createPool({
  connectionLimit: 10,
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
})

db.query = (sql, callback) => {
  if (!sql) {
    callback()
    return
  }
  pool.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err)
      callback(err, null)
      return
    }

    callback(null, rows, fields)
  })
}

module.exports = db
