const express = require('express')
const router = express.Router()
const ScanDestinationsModel = require('../models/scan_destinations')
const ScanCalendarModel = require('../models/scan_calendar')
const { to } = require('../lib/util')

// 乐园基本信息
router.get('/destinations/:local/:type', async (req, res, next) => {
  try {
    let data, err

    let { local, type } = req.params
    let { filters } = req.query

    if (type === 'infos') {
      filters = filters.split(',')

      let find = {
        local
      }
      ;[err, data] = await to(ScanDestinationsModel.findOne(find))
      let destinations = data
      let { added, facetGroups } = destinations

      data = added.filter(item => {
        return filters.indexOf(item.type) !== -1
      })
    } else if (type === 'facetgroups') {
      let find = {
        local
      }
      ;[err, data] = await to(ScanDestinationsModel.findOne(find))
      let destinations = data
      data = destinations.facetGroups
    } else {
      throw new Error('type ERR')
    }

    return res.retData(data)
  } catch (e) {
    return res.retErr(e.message)
  }
})

// 演出日历
router.get('/calendars/:local', async (req, res, next) => {
  try {
    let data, err
    let { local } = req.params
    let { date } = req.query
    let find = {
      local,
      date
    }
    ;[err, data] = await to(ScanCalendarModel.findOne(find))

    return res.retData(data)
  } catch (e) {
    return res.retErr(e.message)
  }
})

module.exports = router
