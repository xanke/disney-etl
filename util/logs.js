module.exports = {
  msg: (name, msg, conf) => {
    let { local, date } = conf
    let text = `${name} ${local} ${date} ${msg}`
    console.log(text)
    return text
  }
}
