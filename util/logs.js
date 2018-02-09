const log4js = require('log4js')
const logger = log4js.getLogger()

log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'logs/etl.log' } },
  categories: { default: { appenders: ['cheese'], level: 'all' } }
})

module.exports = {
  msg: (name, msg, conf) => {
    let { local, date } = conf
    let text = `${name} ${local} ${date} ${msg}`
    console.log(text)
    logger.info(text)
    return text
  }
}
