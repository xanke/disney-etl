module.exports = function(app) {
  app.use('/info', require('./info'))
  app.use('/wait', require('./info'))
  // 404 page
  app.use((req, res) => {
    if (!res.headersSent) {
      res.json({ err: '404' })
    }
  })
}
