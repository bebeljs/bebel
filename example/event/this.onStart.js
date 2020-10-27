const express = require('express')
const path = require('path')

module.exports = function () {
  console.log(`Server start on port ${this.$express.get('port')}`)
  console.log('You can test API at http://localhost:8000')

  this.$express.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.send()
  })
  this.$express.use(express.static(path.join(__dirname, '..', 'public')))
}
