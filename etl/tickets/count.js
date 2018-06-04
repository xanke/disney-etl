const moment = require('moment')
const ScanTicketsModel = require('../../models/scan_ticket')
const DsTicketsModel = require('../../models/ds_ticket')
const { to } = require('../../util')

let Name = 'tickets-count'

const start = async conf => {
  let { date, local, disneyLnad } = conf
  var err, data

  var find = {
    local,
    date
  }
  ;[err, data] = await to(ScanTicketsModel.findOne(find))
  if (err) throw new Error('无数据')

  const { availableList } = data
  const ticketDate = data.date

  const sales = []
  availableList.forEach(item => {
    const [timex, available] = item
    let _date = moment(timex, 'x').format('YYYY-MM-DD')
    const num = moment(_date, 'YYYY-MM-DD').diff(moment(ticketDate, 'YYYY-MM-DD')) / 86400000 - 1
    // item.ticketNum = 20000 - item.availableCount
    // const { date } = moment()
    sales[num] = 20000 - available

  })

  let saleList = []

  for (let k in sales) {
    k = parseInt(k)
    saleList.push([k, sales[k]])
  }

  console.log(saleList)

  data = {
    date,
    saleList
  }

  await DsTicketsModel.update(find, data)
  console.log(date, 'ok')
}

module.exports = start
