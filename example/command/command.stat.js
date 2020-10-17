module.exports = function (param) {
  return {
    info: 'Stat of API usage',
    body: this.global.stat
  }
}
