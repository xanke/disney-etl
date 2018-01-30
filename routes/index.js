module.exports = function(app) {
  app.use('/info', require('./info'))
  app.use('/task', require('./task'))

  app.use('/explorer-service', require('./explorer-service'))

  // 404 page
  app.use((req, res) => {
    if (!res.headersSent) {
      res.json({ err: '404' })
    }
  })
}
