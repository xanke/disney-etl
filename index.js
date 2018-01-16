const path = require('path')
const express = require('express')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
const winston = require('winston')
const expressWinston = require('express-winston')
const http = require('http')
const https = require('https')
const fs = require('fs')
const app = express()

app.use((req, res, next) => {
  res.retErr = (err, code = 400) => {
    res.json({ err, code })
  }
  res.retData = (data, mode = '', code = 200) => {
    if (mode === 'arr') {
      let arr = data
      let total = arr.length
      data = {
        arr,
        total
      }
    }
    res.json({ data, code })
  }
  next()
})

// 路由
routes(app)

// 正常请求的日志
// app.use(
//   expressWinston.logger({
//     transports: [
//       new winston.transports.Console({
//         json: true,
//         colorize: true
//       }),
//       new winston.transports.File({
//         filename: 'logs/success.log'
//       })
//     ]
//   })
// )

// 错误请求的日志
// app.use(
//   expressWinston.errorLogger({
//     transports: [
//       new winston.transports.Console({
//         json: true,
//         colorize: true
//       }),
//       new winston.transports.File({
//         filename: 'logs/error.log'
//       })
//     ]
//   })
// )

//错误返回
app.use((err, req, res, next) => {
  res.retErr(err.message)
})

if (module.parent) {
  // 被 require，则导出 app
  module.exports = app
} else {
  var key = fs.readFileSync('./cert/privatekey.pem', 'utf8')
  var cert = fs.readFileSync('./cert/certificate.crt', 'utf8')
  var credentials = { key, cert }
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'production') {
    http.createServer(app).listen(17101)
  } else {
    // http.createServer(app).listen(80)
    var httpsServer = https.createServer(credentials, app)
    httpsServer.listen(443)
  }
  console.log('Disney-ETL')
}
