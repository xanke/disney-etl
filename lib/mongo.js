const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
mongolass.connect(config.mongodb)

// DISNEY-SCAN

// 乐园项目介绍
exports.ScanDestinations = mongolass.model('Scan_Destinations')
exports.ScanDestinations.index({ date: 1, local: 1 }).exec()

// 乐园信息
exports.ScanInfo = mongolass.model('ScanInfo')
exports.ScanInfo.index({ date: 1, local: 1 }).exec()

// 乐园日历
exports.ScanCalendar = mongolass.model('Scan_Calendar')
exports.ScanCalendar.index({ date: 1, local: 1 }).exec()

// 乐园时间表
exports.ScanSchedules = mongolass.model('Scan_Schedules')
exports.ScanSchedules.index({ date: 1, local: 1 }).exec()

// 等待时间
exports.ScanWait = mongolass.model('Scan_Wait')
exports.ScanWait.index({ date: 1, local: 1 }).exec()
exports.ScanWait.index({ date: 1, local: 1, utime: 1 }).exec()

// 售票量
exports.ScanTicket = mongolass.model('Scan_Ticket')
exports.ScanTicket.index({ date: 1, local: 1 }).exec()

// DISNEY-ETL

// 游乐项目
exports.DsAttraction = mongolass.model('Ds_Attraction')
exports.DsAttraction.index({ date: 1, local: 1 }).exec()

// 主题乐园
exports.DsPark = mongolass.model('Ds_Park')
exports.DsPark.index({ date: 1, local: 1 }).exec()

// 乐园信息
exports.Info = mongolass.model('Info')
exports.Info.index({ date: 1, local: 1 }).exec()
exports.Info.index({ id: 1 }).exec()
