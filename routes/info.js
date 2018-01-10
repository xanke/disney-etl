const express = require('express')
const router = express.Router()
const infoModel = require('../models/info')

function handerMethod(query, res, next) {
  let {
    st = '20180109',
    et = '',
    local = 'shanghai',
    indicators = '',
    method = ''
  } = query

  if (!method) {
    throw new Error('无Method')
  }

  method = method.split('/')
  let [name, ..._method] = method

  if (name === 'opentime') {
    let [method = 'day'] = _method
    infoModel
      .getOpentime(local, method, st, et)
      .then(data => {
        res.retData(data, 'arr')
      })
      .catch(next)
  } else if (name === 'att') {
    let [method = 'day'] = _method
    if (!indicators) {
      throw new Error('无indicators')
    }
    infoModel
      .getAttWait(local, method, indicators, st, et)
      .then(data => {
        res.retData(data, 'arr')
      })
      .catch(next)
  } else {
    throw new Error('Method不存在')
  }
}

// 乐园基本信息
router.get('/', (req, res, next) => {
  handerMethod(req.query, res, next)
})

module.exports = router
