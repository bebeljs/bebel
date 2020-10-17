module.exports = class {
  constructor (THIS) {
    this.stat = {}
    for (const resource in THIS.$method) {
      if (THIS.$method[resource] === 'command') {
        this.stat[resource] = 0
      }
    }
  }
}
