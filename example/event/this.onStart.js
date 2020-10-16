module.exports = function () {
  console.log(`Server start on port ${this.$express.get('port')}`)

  this.$express.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.send()
  })
}