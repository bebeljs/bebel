module.exports = function (param) {
  return {
    info: 'Stat of API usage. Now, try promise callback : ["echo", "anything"]',
    body: this.global.stat
  }
}
