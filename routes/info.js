const express = require('express')
const router = express.Router()
const infoModel = require('../models/info')

// 乐园基本信息
router.get('/', (req, res, next) => {
  let today = '20180109'
  let { mode = 'basic', date = today, local = 'shanghai'} = req.query

  console.log(date)

  infoModel
    .getday(local, date, mode)
    .then(data => {
      res.retData(data, 'arr')
    })
    .catch(next)
})

module.exports = router
