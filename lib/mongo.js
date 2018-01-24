const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 乐园信息
exports.Info = mongolass.model('Info')
exports.Info.index({ date: 1, local: 1 }).exec()
exports.Info.index({ id: 1 }).exec()

// 乐园信息
exports.ScanInfo = mongolass.model('ScanInfo')
exports.ScanInfo.index({ date: 1, local: 1 }).exec()

// 乐园等待时间
exports.ScanWait = mongolass.model('ScanWait')
exports.ScanWait.index({ date: 1, local: 1, utime: 1 }).exec()
