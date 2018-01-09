module.exports = function(app) {
  app.use('/info', require('./info'))
  // 404 page
  app.use((req, res) => {
    if (!res.headersSent) {
      res.json({ err: '404' })
    }
  })
}
