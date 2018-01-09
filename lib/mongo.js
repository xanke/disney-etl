const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// 乐园信息
exports.Info = mongolass.model('Info')
exports.Info.index({ date: 1, local: 1 }).exec()
exports.Info.index({ id: 1 }).exec()
