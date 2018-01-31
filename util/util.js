const crypto = require('crypto')
const md5 = crypto.createHash('md5')

var createSession = () => {
  return (
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2)
  )
}

exports.createSession = createSession

exports.to = promise => {
  return promise
    .then(data => {
      return [null, data]
    })
    .catch(err => [err])
}

function removeProperty(object) {
  for (let key in object) {
    let value = object[key]
    if (value === '' || value === undefined) {
      delete object[key]
    }
  }
}

exports.removeProperty = removeProperty

exports.md5 = str => {
  var ret = crypto
    .createHash('md5')
    .update(str.toString())
    .digest('hex')
  return ret
}
