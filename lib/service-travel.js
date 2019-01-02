// 天气服务
const config = require('config-lite')(__dirname)
const superAgent = require('superagent')
const moment = require('moment')

let ApiUrl = config.travelService.url

module.exports = {
  flowDay: async (cid, date) => {
    let data = await superAgent.get(`${ApiUrl}/flows/${cid}/day/${date}`)
    return data.body
  }
}
