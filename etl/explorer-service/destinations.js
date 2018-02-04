const qiniu = require('qiniu')
const config = require('config-lite')(__dirname)
const ScanSchedulesModel = require('../../models/scan_schedules')
const ScanDestinationsModel = require('../../models/scan_destinations')
const { lineToObject } = require('../../common/api_tool')
const Logs = require('../../util/logs')

let Name = 'Destinations'

const start = async conf => {
  let { local } = conf
  let data = await ScanDestinationsModel.getByLocal(local)
  let str_json = JSON.stringify(data)

  let key=`explorer-service/destinations/${local}`;
  await updateToQiniu(key, str_json)
  return Logs.msg(Name, 'OK', conf)
}

const updateToQiniu = (key, str_json) => {
  return new Promise((resolve, reject) => {
    let uploadToken = getUploadToken(key)
    var qiniuConfig = new qiniu.conf.Config()
    qiniuConfig.force = true
    qiniuConfig.zone = qiniu.zone.Zone_z0

    var formUploader = new qiniu.form_up.FormUploader(qiniuConfig)
    var putExtra = new qiniu.form_up.PutExtra()
    putExtra.mimeType = 'application/json'

    formUploader.put(uploadToken, key, str_json, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        console.log(respBody)

        resolve(respBody)
      } else {
        console.log(respInfo.statusCode)
        console.log(respBody)
        resolve(respBody)
      }
    })
  })
}

const getUploadToken = (key) => {
  let accessKey = config.qiniu_ak
  let secretKey = config.qiniu_sk
  let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  let options = {
    scope: config.qiniu_bucket
  }
  let putPolicy = new qiniu.rs.PutPolicy(options)
  putPolicy.scope = `${config.qiniu_bucket}:${key}`
  let uploadToken = putPolicy.uploadToken(mac)
  return uploadToken
}

module.exports = start
