module.exports = function () {
  console.log(`O : ${this.$query.command}`)
  this.global.stat[this.$query.command]++
}
